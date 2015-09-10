/// <reference path="objection.d.ts" />
/// <reference path="..\knex\knex.d.ts" />

import Knex = require("knex");
import objection = require("objection");

var knex = Knex({
  client: 'postgres',
  connection: {
    host: '127.0.0.1',
    database: 'your_database',
    user: 'austin',
    password: 'powers'
  }
});

objection.Model.knex(knex);

class Person extends objection.Model
{
    
    constructor() {
        super();
        objection.Model.apply(this, arguments);
    }
}

objection.Model.extend(Person);

// Table name is the only required property.
Person.tableName = 'Person';

// This is not the database schema! Nothing is generated based on this. Whenever a
// Person object is created from a JSON object, the JSON is checked against this
// schema. For example when you call Person.fromJson({firstName: 'Jennifer'});
Person.jsonSchema = {
    type: 'object',
    required: ['firstName', 'lastName'],

    properties: {
    id: {type: 'integer'},
    parentId: {type: ['integer', 'null']},
    firstName: {type: 'string', minLength: 1, maxLength: 255},
    lastName: {type: 'string', minLength: 1, maxLength: 255},
    age: {type: 'number'},

    address: {
        type: 'object',
        properties: {
        street: {type: 'string'},
        city: {type: 'string'},
        zipCode: {type: 'string'}
        }
    }
    }
};

// This object defines the relations to other models.
Person.relationMappings = {
    pets: {
        relation: objection.Model.OneToManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: __dirname + '/Animal',
        join: {
            from: 'Person.id',
            to: 'Animal.ownerId'
        }
    },

    movies: {
        relation: objection.Model.ManyToManyRelation,
        modelClass: __dirname + '/Movie',
        join: {
            from: 'Person.id',
            // ManyToMany relation needs the `through` object to describe the join table.
            through: {
            from: 'Person_Movie.personId',
            to: 'Person_Movie.movieId'
            },
            to: 'Movie.id'
        }
    },

    children: {
        relation: objection.Model.OneToManyRelation,
        modelClass: Person,
        join: {
            from: 'Person.id',
            to: 'Person.parentId'
        }
    }
};


 // Get all rows.
 Person.query().then(function(allPersons) {
   console.log('there are', allPersons.length, 'persons in the database');
 });

 // Example of a more complex WHERE clause. This generates:
 // SELECT  FROM "Person" WHERE ("firstName" = 'Jennifer' AND "age" < 30) OR ("firstName" = "Mark" AND "age" > 30)
 Person
   .query()
   .where(function () {
     this.where('firstName', 'Jennifer').where('age', '<', 30);
   })
   .orWhere(function () {
     this.where('firstName', 'Mark').where('age', '>', 30);
   })
   .then(function (marksAndJennifers) {
     console.log(marksAndJennifers);
   });

// Get a subset of rows and fetch related models for each row.
//! ATTENTION: Does not compile with current version. Need to put eager() call first: 
//! Person
//!    .query()
//!    .where('age', '>', 60)
//!    .eager('children.children.movies')
//!    .then(function (oldPeople) {
//!      console.log('some old person\'s grand child has appeared in',
//!        oldPeople[0].children[0].children[0].movies.length,
//!        'movies');
//!    });

//! This compiles:
Person
.query()
.eager('children.children.movies')
.where('age', '>', 60)
.then(function (oldPeople) {
    console.log('some old person\'s grand child has appeared in',
    oldPeople[0].children[0].children[0].movies.length,
    'movies');
});


Person.query().insert({firstName: 'Sylvester', lastName: 'Stallone'}).then(function (sylvester) {
console.log(sylvester.fullName()); // --> 'Sylvester Stallone'.
});

// Batch insert. This only works on Postgresql as it is the only database that returns the
// identifiers of _all_ inserted rows. If you need to do batch inserts on other databases use
// knex directly. (See .knexQuery() method).
Person
   .query()
   .insert([
     {firstName: 'Arnold', lastName: 'Schwarzenegger'},
     {firstName: 'Sylvester', lastName: 'Stallone'}
   ])
   .then(function (inserted) {
     console.log(inserted[0].fullName()); // --> 'Arnold Schwarzenegger'
   });

var jennifer = { id : 123 };

Person
   .query()
   .update({firstName: 'Jennifer', lastName: 'Lawrence', age: 35})
   .where('id', jennifer.id)
   .then(function (updatedJennifer) {
     console.log('Jennifer is now', updatedJennifer.age, 'years old');
   });

// This will throw assuming that `firstName` or `lastName` is a required property for a Person.
Person.query().patch({age: 100});

// This will _not_ throw.
Person
.query()
.patch({age: 100})
.then(function () {
    console.log('Everyone is now 100 years old');
});


Person
.query()
.delete()
.where('age', '>', 90)
.then(function () {
    console.log('anyone over 90 is now removed from the database');
});