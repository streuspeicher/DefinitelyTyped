// Type definitions for objection v0.2.x
// Project: https://github.com/Vincit/objection.js/
// Definitions by: Norbert Wagner <https://github.com/streuspeicher>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../knex/knex.d.ts" />

declare module "objection" {

    import Knex = require('knex');

//     export interface IMoron {
// 
//         ModelBase: any; //require('./src/ModelBase'),
//         Model: any; //require('./src/Model'),
//         QueryBuilder: any; //require('./src/QueryBuilder'),
//         RelationExpression: any; //require('./src/RelationExpression'),
//         ValidationError: any; //require('./src/ValidationError'),
// 
//         Relation: any; //require('./src/relations/Relation'),
//         OneToOneRelation: any; //require('./src/relations/OneToOneRelation'),
//         OneToManyRelation: any; //require('./src/relations/OneToManyRelation'),
//         ManyToManyRelation: any; //require('./src/relations/ManyToManyRelation'),
// 
//         transaction: any; //require('./src/transaction'),
// 
//         // Backwards compatibility. This change was made when the library probably had 10 users. So
//         // these can be removed as soon as semver rules allow it.
//         MoronModelBase: any; //require('./src/ModelBase'),
//         MoronModel: any; //require('./src/Model'),
//         MoronQueryBuilder: any; //require('./src/QueryBuilder'),
//         MoronRelationExpression: any; //require('./src/RelationExpression'),
//         MoronValidationError: any; //require('./src/ValidationError'),
//         MoronRelation: any; //require('./src/relations/Relation'),
//         MoronOneToOneRelation: any; //require('./src/relations/OneToOneRelation'),
//         MoronOneToManyRelation: any; //require('./src/relations/OneToManyRelation'),
//         MoronManyToManyRelation: any; //require('./src/relations/ManyToManyRelation')
// 
//     }


    /**
    * Base class for models.
    *
    * ModelBase provides a mechanism for automatic JSON validation and a way to attach
    * functionality to plain javascript objects. A subclass can be created like this:
    *
    * ```js
    * function Person() {
    *   ModelBase.apply(this, arguments);
    * }
    *
    * ModelBase.extend(Person);
    *
    * Person.prototype.fullName = function () {
    *   return this.firstName + ' ' + this.lastName;
    * };
    *
    * Person.jsonSchema = {
    *   type: 'object',
    *   properties: {
    *     id: {type: 'integer'},
    *     firstName: {type: 'string'},
    *     lastName: {type: 'string'}
    *   }
    * };
    * ```
    *
    * Use `ModelBase.from*Json` methods to create models from JSON objects:
    *
    * ```js
    * var person = Person.fromJson({firstName: 'Jennifer', lastName: 'Lawrence'});
    *
    * console.log(person.firstName); // --> 'Jennifer'
    * console.log(person.lastName); // --> 'Lawrence'
    * console.log(person.fullName()); // --> 'Jennifer Lawrence'
    *
    * // This throws because the schema validation fails.
    * var person2 = Person.fromJson({firstName: 10});
    * ```
    *
    * Properties that are prefixed with '$' are excluded from all JSON representations:
    *
    * ```js
    * var person = Person.fromJson({firstName: 'Jennifer');
    * person.$spam = 100;
    *
    * console.log(person); // --> {firstName: 'Jennifer'}
    * console.log(person.$toJson()); // --> {firstName: 'Jennifer'}
    * ```
    *
    * ModelBase makes it possible to have a different database representation for a model.
    * For example if your column names are snake_cased in the database but you want to use
    * camelCased properties in the code and outside the server you can do this:
    *
    * ```js
    * // This is called when an object is serialized to database format.
    * Person.prototype.$formatDatabaseJson = function (json) {
    *   // Call superclass implementation.
    *   json = ModelBase.prototype.$formatDatabaseJson.call(this, json);
    *
    *   return _.mapKeys(json, function (value, key) {
    *     return _.snakeCase(key);
    *   });
    * };
    *
    * // This is called when an object is read from database.
    * Person.prototype.$parseDatabaseJson = function (json) {
    *   json = _.mapKeys(json, function (value, key) {
    *     return _.camelCase(key);
    *   });
    *
    *   // Call superclass implementation.
    *   return ModelBase.prototype.$parseDatabaseJson.call(this, json);
    * };
    * ```
    */
    class ModelBase 
    {
        
        /**
        * This is called before validation.
        *
        * Here you can dynamically edit the jsonSchema if needed.
        *
        * @param {Object} jsonSchema
        *    A deep clone of this class's jsonSchema.
        *
        * @param {Object} json
        *    The JSON object to be validated.
        *
        * @param {ModelOptions=} options
        *    Optional options.
        *
        * @return {Object}
        *    The (possibly) modified jsonSchema.
        */
        $beforeValidate(jsonSchema : any, json : any, options : ModelOptions) : any;

        /**
        * Validates the given JSON object.
        *
        * Calls `$beforeValidation` and `$afterValidation` methods. This method is called
        * automatically from `fromJson` and `$setJson` methods. This method can also be
        * called explicitly when needed.
        *
        * @throws {ValidationError}
        *    If validation fails.
        *
        * @param {Object=} json
        *    If not given ==> this.
        *
        * @param {ModelOptions=} options
        *    Optional options.
        *
        * @return {Object}
        *    The input json
        */
        $validate( json : any, options : ModelOptions) : any;
        
        /**
        * This is called after successful validation.
        *
        * You can do further validation here and throw a ValidationError if something goes wrong.
        *
        * @param {Object=} json
        *    The JSON object to validate.
        *
        * @param {ModelOptions=} options
        *    Optional options.
        */
        $afterValidate(json : any, options : ModelOptions) : void;
        
        /**
        * Exports this model as a JSON object.
        *
        * For JSON.stringify compatibility.
        */
        toJSON() : any;
        
        /**
        * The optional schema against which the JSON is validated.
        *
        * The jsonSchema can be dynamically modified in the `$beforeValidate` method.
        *
        * Must follow http://json-schema.org specification. If null no validation is done.
        *
        * @see $beforeValidate()
        * @see $validate()
        * @see $afterValidate()
        *
        * @type {Object}
        */
        static jsonSchema : any;
        
        /**
        * Makes the given constructor a subclass of this class.
        *
        * @param {function=} subclassConstructor
        * @return {function}
        */
        static extend(subclass : any) : any;
        
        /**
        * Creates a model instance from a JSON object.
        *
        * The object is checked against `jsonSchema` and an exception is thrown on failure.
        *
        * @param {Object=} json
        *    The JSON from which to create the model.
        *
        * @param {ModelOptions=} options
        *    Optional options.
        *
        * @throws ValidationError
        *    If validation fails.
        */
        static fromJson(json : any, options : ModelOptions) : any;
    }
    
    
    /**
    * Subclasses of this class represent database tables.
    *
    * Subclass can be created like this:
    *
    * ```js
    var Model = require('objection').Model;
    
    function Person() {
        Model.apply(this, arguments);
    }
    
    Model.extend(Person);
    module.exports = Person;
    
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
        relation: Model.OneToManyRelation,
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
        relation: Model.ManyToManyRelation,
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
        relation: Model.OneToManyRelation,
        modelClass: Person,
        join: {
            from: 'Person.id',
            to: 'Person.parentId'
        }
        }
    };
    * ```
    *
    */
    export class Model extends ModelBase {


        static extend(model: any): void;
        
        /**
        * Name of the database table of this model.
        */
        static tableName : string;
        
        /**
        * Name of the primary key column in the database table.
        *
        * Defaults to 'id'.
        * */
        static idColumn : string
        
        /**
        * one-to-many relation type.
        *
        * @type {OneToOneRelation}
        */
        static OneToOneRelation : OneToOneRelationType;

        /**
        * one-to-many relation type.
        *
        * @type {OneToManyRelation}
        */
        static OneToManyRelation : OneToManyRelationType;

        /**
        * may-to-many relation type.
        *
        * @type {ManyToManyRelation}
        */
        static ManyToManyRelation : ManyToManyRelationType;
            
        /**
        * Properties that should be saved to database as JSON strings.
        *
        * The properties listed here are serialized to JSON strings upon insertion to the database
        * and parsed back to objects when models are read from the database. Combined with the
        * postgresql's json or jsonb data type, this is a powerful way of representing documents
        * as single database rows.
        *
        * If this property is left unset all properties declared as objects or arrays in the
        * `jsonSchema` are implicitly added to this list.
        *
        * Example:
        *
        * ```js
        * Person.jsonAttributes = ['address'];
        *
        * var jennifer = Person.fromJson({
        *   name: 'Jennifer',
        *   address: {
        *     address: 'Someroad 10',
        *     zipCode: '1234',
        *     city: 'Los Angeles'
        *   }
        * });
        *
        * var dbRow = jennifer.$toDatabaseJson();
        * console.log(dbRow);
        * // --> {name: 'Jennifer', address: '{"address":"Someroad 10","zipCode":"1234","city":"Los Angeles"}'}
        * ```
        */
        static jsonAttributes : string[];
        
        /**
        * This property defines the relations to other models.
        *
        * Relations to other models can be defined by setting this property. The best way to explain how to
        * do this is by example:
        *
        * ```js
        * Person.relationMappings = {
        *   pets: {
        *     relation: Model.OneToManyRelation,
        *     modelClass: Animal,
        *     join: {
        *       from: 'Person.id',
        *       to: 'Animal.ownerId'
        *     }
        *   },
        *
        *   father: {
        *     relation: Model.OneToOneRelation,
        *     modelClass: Person,
        *     join: {
        *       from: 'Person.fatherId',
        *       to: 'Person.id'
        *     }
        *   },
        *
        *   movies: {
        *     relation: Model.ManyToManyRelation,
        *     modelClass: Movie,
        *     join: {
        *       from: 'Person.id',
        *       through: {
        *         from: 'Person_Movie.actorId',
        *         to: 'Person_Movie.movieId'
        *       },
        *       to: 'Movie.id'
        *     }
        *   }
        * };
        * ```
        *
        * relationMappings is an object whose keys are relation names and values define the relation. The
        * `join` property in addition to the relation type define how the models are related to one another.
        * The `from` and `to` properties of the `join` object define the database columns through which the
        * models are associated. Note that neither of these columns need to be primary keys. They can be any
        * columns!. In the case of ManyToManyRelation also the join table needs to be defined. This is
        * done using the `through` object.
        *
        * The `modelClass` passed to the relation mappings is the class of the related model. It can be either
        * a Model subclass constructor or an absolute path to a module that exports one. Using file paths
        * is a handy way to prevent require loops.
        *
        * @type {Object.<String, RelationMapping>}
        */
        static relationMappings : any;
        
        /**
        * Creates a query builder for this table.
        *
        * The returned query builder has all the methods a *knex* query builder has. See
        * {@link QueryBuilder} and <a href="http://knexjs.org/#Builder">knexjs.org</a>
        * for more information.
        *
        * Examples:
        *
        * Read models from the database:
        *
        * ```js
        * // Get all rows.
        * Person.query().then(function(allPersons) {
        *   console.log('there are', allPersons.length, 'persons in the database');
        * });
        *
        * // Example of a more complex WHERE clause. This generates:
        * // SELECT * FROM "Person" WHERE ("firstName" = 'Jennifer' AND "age" < 30) OR ("firstName" = "Mark" AND "age" > 30)
        * Person
        *   .query()
        *   .where(function () {
        *     this.where('firstName', 'Jennifer').where('age', '<', 30);
        *   })
        *   .orWhere(function () {
        *     this.where('firstName', 'Mark').where('age', '>', 30);
        *   })
        *   .then(function (marksAndJennifers) {
        *     console.log(marksAndJennifers);
        *   });
        *
        * // Get a subset of rows and fetch related models for each row.
        * Person
        *   .query()
        *   .where('age', '>', 60)
        *   .eager('children.children.movies')
        *   .then(function (oldPeople) {
        *     console.log('some old person\'s grand child has appeared in',
        *       oldPeople[0].children[0].children[0].movies.length,
        *       'movies');
        *   });
        * ```
        *
        * Insert models to the database:
        *
        * ```js
        * Person.query().insert({firstName: 'Sylvester', lastName: 'Stallone'}).then(function (sylvester) {
        *   console.log(sylvester.fullName()); // --> 'Sylvester Stallone'.
        * });
        *
        * // Batch insert. This only works on Postgresql as it is the only database that returns the
        * // identifiers of _all_ inserted rows. If you need to do batch inserts on other databases use
        * // *knex* directly. (See .knexQuery() method).
        * Person
        *   .query()
        *   .insert([
        *     {firstName: 'Arnold', lastName: 'Schwarzenegger'},
        *     {firstName: 'Sylvester', lastName: 'Stallone'}
        *   ])
        *   .then(function (inserted) {
        *     console.log(inserted[0].fullName()); // --> 'Arnold Schwarzenegger'
        *   });
        * ```
        *
        * `update` and `patch` can be used to update models. Only difference between the mentioned methods
        * is that `update` validates the input objects using the model class's full jsonSchema and `patch`
        * ignores the `required` property of the schema. Use `update` when you want to update _all_ properties
        * of a model and `patch` when only a subset should be updated.
        *
        * ```js
        * Person
        *   .query()
        *   .update({firstName: 'Jennifer', lastName: 'Lawrence', age: 35})
        *   .where('id', jennifer.id)
        *   .then(function (updatedJennifer) {
        *     console.log('Jennifer is now', updatedJennifer.age, 'years old');
        *   });
        *
        * // This will throw assuming that `firstName` or `lastName` is a required property for a Person.
        * Person.query().patch({age: 100});
        *
        * // This will _not_ throw.
        * Person
        *   .query()
        *   .patch({age: 100})
        *   .then(function () {
        *     console.log('Everyone is now 100 years old');
        *   });
        * ```
        *
        * Models can be deleted using the delete method. Naturally the delete query can be chained with
        * any *knex* methods:
        *
        * ```js
        * Person
        *   .query()
        *   .delete()
        *   .where('age', '>', 90)
        *   .then(function () {
        *     console.log('anyone over 90 is now removed from the database');
        *   });
        * ```
        *
        * @returns {QueryBuilder}
        */
        static query(): QueryBuilderInstance;
        
        /**
        * Set the knex instance for this model class.
        *
        * Subclasses inherit the connection. A system-wide knex instance can thus be set by calling
        * `Model.knex(knex)`. This works even after subclasses have been created.
        *
        * ```js
        * var knex = require('knex')({
        *   client: 'sqlite3',
        *   connection: {
        *     filename: 'database.db'
        *   }
        * });
        *
        * Model.knex(knex);
        * knex = Model.knex();
        * ```
        *
        * @param {knex=} knex
        *    The knex to set.
        *
        * @returns {knex|undefined}
        */
        static knex(knex : Knex) : void;
        
        /**
        * Get the knex instance for this model class.
        *
        */
        static knex() : Knex;

        
        /**
         * Gets the value of the id property.
         */
        $id(): any
        
        /**
         * Sets the value of the id property
         */
        $id(value: any): void;
        
        /**
        * Creates a query builder for this model instance.
        *
        * The returned query builder has all the methods a *knex* query builder has. See
        * {@link QueryBuilder} and <a href="http://knexjs.org/#Builder">knexjs.org</a>
        * for more information.
        *
        * All queries built using the returned builder only affect this instance.
        *
        * Examples:
        *
        * Re-fetch the instance from the database:
        *
        * ```js
        * person.$query().then(function (person) {
        *   console.log(person);
        * });
        * ```
        *
        * Insert a new model to database:
        *
        * ```js
        * Person.fromJson({firstName: 'Jennifer'}).$query().insert().then(function (jennifer) {
        *   console.log(jennifer.id);
        * });
        * ```
        *
        * Patch a model:
        *
        * ```js
        * person.$query().patch({lastName: 'Cooper'}).then(function (person) {
        *   console.log(person.lastName); // --> 'Cooper'.
        * });
        * ```
        *
        * Delete a model.
        *
        * ```js
        * person.$query().delete().then(function () {
        *   console.log('person deleted');
        * });
        * ```
        *
        * @returns {QueryBuilder}
        */

        $query(): QueryBuilderInstance;
   
    
        /**
        * Use this to build a query that only affects the models related to this instance through a relation.
        *
        * The returned query builder has all the methods a *knex* query builder has. See
        * {@link QueryBuilder} and <a href="http://knexjs.org/#Builder">knexjs.org</a>
        * for more information.
        *
        * Examples:
        *
        * Fetch all models related to this instance through a relation. The fetched models are
        * also stored to the owner model's property named after the relation:
        *
        * ```js
        * jennifer.$relatedQuery('pets').then(function (pets) {
        *   console.log('jennifer has', pets.length, 'pets');
        *   console.log(jennifer.pets === pets); // --> true
        * });
        * ```
        *
        * The related query is just like any other query. All *knex* methods are available:
        *
        * ```js
        * jennifer
        *   .$relatedQuery('pets')
        *   .select('Animal.*', 'Person.name as ownerName')
        *   .where('species', '=', 'dog')
        *   .orWhere('breed', '=', 'cat')
        *   .innerJoin('Person', 'Person.id', 'Animal.ownerId')
        *   .orderBy('Animal.name')
        *   .then(function (dogsAndCats) {
        *     // All the dogs and cats have the owner's name "Jennifer" joined as the `ownerName` property.
        *     console.log(dogsAndCats);
        *   });
        * ```
        *
        * This inserts a new model to the database and binds it to the owner model as defined
        * by the relation:
        *
        * ```js
        * jennifer
        *   .$relatedQuery('pets')
        *   .insert({species: 'dog', name: 'Fluffy'})
        *   .then(function (waldo) {
        *     console.log(waldo.id);
        *   });
        * ```
        *
        * To add an existing model to a relation the `relate` method can be used. In this example
        * the dog `fluffy` already exists in the database but it isn't related to `jennifer` through
        * the `pets` relation. We can make the connection like this:
        *
        * ```js
        * jennifer
        *   .$relatedQuery('pets')
        *   .relate(fluffy.id)
        *   .then(function () {
        *     console.log('fluffy is now related to jennifer through pets relation');
        *   });
        * ```
        *
        * The connection can be removed using the `unrelate` method. Again, this doesn't delete the
        * related model. Only the connection is removed. For example in the case of ManyToMany relation
        * the join table entries are deleted.
        *
        * ```js
        * jennifer
        *   .$relatedQuery('pets')
        *   .unrelate()
        *   .where('id', fluffy.id)
        *   .then(function () {
        *     console.log('jennifer no longer has fluffy as a pet');
        *   });
        * ```
        *
        * Related models can be deleted using the delete method. Note that in the case of ManyToManyRelation
        * the join table entries are not deleted. Naturally the delete query can be chained with any *knex*
        * methods.
        *
        * ```js
        * jennifer
        *   .$relatedQuery('pets')
        *   .delete()
        *   .where('species', 'cat')
        *   .then(function () {
        *     console.log('jennifer no longer has any cats');
        *   });
        * ```
        *
        * `update` and `patch` can be used to update related models. Only difference between the mentioned
        * methods is that `update` validates the input objects using the related model class's full schema
        * and `patch` ignores the `required` property of the schema. Use `update` when you want to update
        * _all_ properties of a model and `patch` when only a subset should be updated.
        *
        * ```js
        * jennifer
        *   .$relatedQuery('pets')
        *   .update({species: 'dog', name: 'Fluffy the great', vaccinated: false})
        *   .where('id', fluffy.id)
        *   .then(function (updatedFluffy) {
        *     console.log('fluffy\'s new name is', updatedFluffy.name);
        *   });
        *
        * // This will throw assuming that `name` or `species` is a required property for an Animal.
        * jennifer.$relatedQuery('pets').patch({vaccinated: true});
        *
        * // This will _not_ throw.
        * jennifer
        *   .$relatedQuery('pets')
        *   .patch({vaccinated: true})
        *   .where('species', 'dog')
        *   .then(function () {
        *     console.log('jennifer just got all her dogs vaccinated');
        *   });
        * ```
        *
        * @param {String} relationName
        *    Name of the relation.
        *
        * @returns {QueryBuilder}
        */
        $relatedQuery(relationName: string): QueryBuilderInstance;
        
        /**
        * Loads related models using a {@link RelationExpression}.
        *
        * Example:
        *
        * ```
        * jennifer.$loadRelated('[pets, children.[pets, father]]').then(function (jennifer) {
        *   console.log('Jennifer has', jennifer.pets.length, 'pets');
        *   console.log('Jennifer has', jennifer.children.length, 'children');
        *   console.log('Jennifer\'s first child has', jennifer.children[0].pets.length, 'pets');
        *   console.log('Jennifer had her first child with', jennifer.children[0].father.name);
        * });
        * ```
        *
        * @see {@link RelationExpression} for more examples on relation expressions.
        *
        * @param {String|RelationExpression} relationExpression
        * @returns {Promise}
        */
        $loadRelated(relationExpression: string) : Model;

        $parseDatabaseJson(json : any) : any;
        
        $formatDatabaseJson(json : any) : any;
        
        $setJson(json : any, options : string) : void;
        
        /**
         *  
         * @param {Boolean} shallow
         *      If true the relations are omitted from the json.
         */
        $toJson(shallow : boolean) : any;
        
        /**
        * Called before a model is inserted into the database.
        */
        $beforeInsert() : void;
        
        /**
        * Called after a model has been inserted into the database.
        */
        $afterInsert() : void;
        
        
        /**
        * Called before a model is updated.
        *
        * This method is also called before a model is patched. Therefore all the model's properties
        * may not exist. You can check if the update operation is a patch by checking the `opt.patch`
        * boolean.
        *
        * Also note that this method is called only once when you do something like this:
        *
        * ```js
        * Person
        *   .$query()
        *   .patch({firstName: 'Jennifer'})
        *   .where('gender', 'female')
        *   .then(function () {
        *     ...
        *   });
        * ```
        *
        * The example above updates all rows whose `gender` equals `female` but the `$beforeUpdate`
        * method is called only once for the `{firstName: 'Jennifer'}` model. This is because the
        * updating is done completely in the database and the affected models are never fetched
        * to the javascript side.
        *
        * @param {ModelOptions} opt
        */
        $beforeUpdate(opt : ModelOptions) : void;
        
        /**
        * Called after a model is updated.
        *
        * This method is also called after a model is patched. Therefore all the model's properties
        * may not exist. You can check if the update operation is a patch by checking the `opt.patch`
        * boolean.
        *
        * Also note that this method is called only once when you do something like this:
        *
        * ```js
        * Person
        *   .$query()
        *   .patch({firstName: 'Jennifer'})
        *   .where('gender', 'female')
        *   .then(function () {
        *     ...
        *   });
        * ```
        *
        * The example above updates all rows whose `gender` equals `female` but the `$beforeUpdate`
        * method is called only once for the `{firstName: 'Jennifer'}` model. This is because the
        * updating is done completely in the database and the affected models are never fetched
        * to the javascript side.
        *
        * @param {ModelOptions} opt
        */
        $afterUpdate( opt : ModelOptions ) : void

    }

    export class QueryBuilder  {
        /**
        * Create QueryBuilder for a Model subclass.
        *
        * @param {Model} modelClass
        *    Model subclass.
        */
        static forClass( model : Model) : QueryBuilder;
            
    }
    
    export interface QueryBuilderInstance extends Knex.QueryBuilder {

        
        /**
        * Skips the database query and "fakes" its result.
        *
        * @param {Array.<Object>} resolve
        * @returns {QueryBuilder}
        */
        resolve() : QueryBuilderInstance;
        
        /**
        * Skips the database query and "fakes" an error result.
        *
        * @param {Error} error
        * @returns {QueryBuilder}
        */
        reject( error : any) : QueryBuilderInstance;
        
        /**
        * Registers a function to be called before the database query when the builder is executed.
        *
        * Multiple functions can be chained like `.then` methods of a promise.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runBefore(function () {
        *    console.log('hello 1');
        *
        *    return Promise.delay(10).then(function () {
        *      console.log('hello 2');
        *    });
        *  })
        *  .runBefore(function () {
        *    console.log('hello 3');
        *  });
        *
        * query.then();
        * // --> hello 1
        * // --> hello 2
        * // --> hello 3
        * ```
        *
        * @param {function} runBefore
        * @returns {QueryBuilder}
        */
        runBefore(runBefore : any) : QueryBuilderInstance;
        
        /**
        * Just like `runBefore` but pushes the function before any other runBefore functions.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runBefore(function () {
        *    console.log('hello 1');
        *  })
        *  .runBeforePushFront(function () {
        *    console.log('hello 2');
        *  });
        *
        * query.then();
        * // --> hello 2
        * // --> hello 1
        * ```
        */
        runBeforePushFront(runBefore: () => void) : QueryBuilderInstance;
        
        /**
        * Registers a function to be called after the database query when the builder is executed.
        *
        * Multiple functions can be chained like `.then` methods of a promise.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runAfterKnexQuery(function (rows) {
        *    return rows;
        *  })
        *  .runAfterKnexQuery(function (rows) {
        *    rows.push({firstName: 'Jennifer'});
        *  });
        *
        * query.then(function (models) {
        *   var jennifer = models[models.length - 1];
        * });
        * ```
        *
        * @param {function} runAfterKnexQuery
        * @returns {QueryBuilder}
        */
        runAfterKnexQuery(runAfterKnexQuery : (rows : any[]) => any[]) : QueryBuilderInstance;
        
        /**
        * Just like `runAfterKnexQuery` but pushes the function before any other runAfterKnexQuery functions.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runAfterKnexQuery(function (rows) {
        *    console.log('hello 1');
        *    return rows;
        *  })
        *  .runAfterKnexQueryPushFront(function (rows) {
        *    console.log('hello 2');
        *    return rows;
        *  });
        *
        * query.then();
        * // --> hello 2
        * // --> hello 1
        * ```
        */
        runAfterKnexQueryPushFront(runAfterKnexQuery : (rows : any[]) => any[]) : QueryBuilderInstance;
        
        /**
        * Registers a function to be called after the database rows are converted to Model instances.
        *
        * Multiple functions can be chained like `.then` methods of a promise.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runAfterModelCreate(function (models) {
        *    models.push(Person.fromJson({firstName: 'Jennifer'}));
        *  });
        *
        * query.then(function (models) {
        *   var jennifer = models[models.length - 1];
        * });
        * ```
        *
        * @param {function} runAfterModelCreate
        * @returns {QueryBuilder}
        */
        runAfterModelCreate(runAfterModelCreate : (models : any[]) => any[]) : QueryBuilderInstance;
        
        /**
        * Just like `runAfterModelCreate` but pushes the function before any other runAfterModelCreate functions.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runAfterModelCreate(function (models) {
        *    console.log('hello 1');
        *    return models;
        *  })
        *  .runAfterModelCreatePushFront(function (models) {
        *    console.log('hello 2');
        *    return models;
        *  });
        *
        * query.then();
        * // --> hello 2
        * // --> hello 1
        * ```
        */
        runAfterModelCreatePushFront(runAfterModelCreate: (models : any[]) => any[]) : QueryBuilderInstance;
        
        /**
        * Registers a function to be called when the builder is executed.
        *
        * Multiple functions can be chained like `.then` methods of a promise.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runAfter(function (models) {
        *    return models;
        *  })
        *  .runAfter(function (models) {
        *    models.push(Person.fromJson({firstName: 'Jennifer'}));
        *  });
        *
        * query.then(function (models) {
        *   var jennifer = models[models.length - 1];
        * });
        * ```
        *
        * @param {function} runAfter
        * @returns {QueryBuilder}
        */
        runAfter(runAfter: (models : any[]) => void) : QueryBuilderInstance;
        
        /**
        * Just like `runAfter` but pushes the function before any other runAfter functions.
        *
        * ```js
        * var query = Person.query();
        *
        * query
        *  .runAfter(function (models) {
        *    console.log('hello 1');
        *    return models;
        *  })
        *  .runAfterPushFront(function (models) {
        *    console.log('hello 2');
        *    return models;
        *  });
        *
        * query.then();
        * // --> hello 2
        * // --> hello 1
        * ```
        */
        runAfterPushFront(runAfter : (models : any[]) => any[]) : QueryBuilderInstance;
        
        /**
        * Fetch relations eagerly for the result rows.
        *
        * Example:
        *
        * ```js
        * // Fetch `children` relation for each result Person and `pets` and `movies`
        * // relations for all the children.
        * Person
        *   .query()
        *   .eager('children.[pets, movies]')
        *   .then(function (persons) {
        *     console.log(persons[0].children[0].pets[0].name);
        *     console.log(persons[0].children[0].movies[0].id);
        *   });
        * ```
        *
        * See {@link RelationExpression} for more examples and documentation.
        *
        * @param {String|RelationExpression} exp
        * @returns {QueryBuilder}
        */
        eager (exp : string|RelationExpression ) : QueryBuilderInstance;
        
        /**
        * Sets the allowed eager expression.
        *
        * Any subset of the allowed expression is accepted by `.eager` method. For example setting
        * the allowed expression to `a.b.c` expressions `a`, `a.b` and `a.b.c` are accepted by `.eager`
        * method. Setting any other expression will reject the query and cause the promise error handlers
        * to be called.
        *
        * This method is useful when the eager expression comes from an untrusted source like query
        * parameters of a http request.
        *
        * ```js
        * Person
        *   .query()
        *   .allowEager('[children.pets, movies]')
        *   .eager(req.query.eager)
        *   .then(function () {
        *
        *   });
        * ```
        *
        * @param {String|RelationExpression} exp
        * @returns {QueryBuilder}
        */
        allowEager(exp : string | RelationExpression) : QueryBuilderInstance;
        
        // /**
        // * Calls the given function immediately and passes `this` as an argument.
        // *
        // * Handy for chaining conditional stuff:
        // *
        // * ```js
        // * Person
        // *   .query()
        // *   .call(function (builder) {
        // *     if (something) {
        // *       builder.where('something', someValue);
        // *     }
        // *   });
        // * ```
        // *
        // * @param {function} func
        // * @returns {QueryBuilder}
        // */
        // call(func : (query : QueryBuilderInstance) => void) : QueryBuilderInstance;
        
        /**
        * Returns the Model subclass this builder is bound to.
        *
        * @returns {Model}
        */
        modelClass() : Model;
        
        /**
        * Returns the SQL string.
        *
        * @returns {String}
        */
        toSql() : string;
        
        /**
        * Logs the SQL string.
        *
        * Handy for debugging:
        *
        * ```js
        * Person
        *   .query()
        *   .where('firstName', 'Jennifer')
        *   .where('age', 100)
        *   .dumpSql()
        *   .then(function () {
        *     ...
        *   });
        * ```
        *
        * @param {function=} logger
        * @returns {QueryBuilder}
        */
        dumpSql(logger? : (sql : string) => void) : QueryBuilderInstance;
        
        /**
        * Builds the query into a knex query builder.
        *
        * @returns {knex.QueryBuilder}
        *    The built knex query builder.
        */
        build() : Knex.QueryBuilder;

        /**
        * Create a clone of this builder.
        *
        * @returns {QueryBuilder}
        */
        clone() : QueryBuilderInstance;
        
        /**
        * Returns the amount of rows the current query would produce without `limit` and `offset` applied.
        *
        * Note that this executes a query (not the one we are building) and returns a Promise. Use it
        * like this:
        *
        * ```js
        * var query = Person
        *   .query()
        *   .where('age', '>', 20);
        *
        * Promise.all([
        *   query.resultSize(),
        *   query.offset(100).limit(50)
        * ]).spread(function (total, models) {
        *   ...
        * });
        * ```
        *
        * @returns {Promise}
        */
        resultSize() : number;
    
        /**
        * Only returns the given page of results.
        *
        * ```js
        * Person
        *   .query()
        *   .where('age', '>', 20)
        *   .page(5, 100)
        *   .then(function (result) {
        *     console.log(result.results.length); // --> 100
        *     console.log(result.total); // --> 3341
        *   });
        * ```
        *
        * @param {Number} page
        *    The index of the page to return.
        *
        * @param {Number} pageSize
        *    The page size.
        *
        * @returns {QueryBuilder}
        */
        page(page : number, pageSize : number) : QueryBuilderInstance;
        
        /**
        * Only returns the given range of results.
        *
        * ```js
        * Person
        *   .query()
        *   .where('age', '>', 20)
        *   .range(0, 100)
        *   .then(function (result) {
        *     console.log(result.results.length); // --> 101
        *     console.log(result.total); // --> 3341
        *   });
        * ```
        *
        * @param {Number} start
        *    The index of the first result (inclusive).
        *
        * @param {Number} end
        *    The index of the last result (inclusive).
        *
        * @returns {QueryBuilder}
        */
        range(start : number, end: number) : QueryBuilderInstance;
    
        /**
        * If the result is an array, plucks a property from each object.
        *
        * ```js
        * Person
        *   .query()
        *   .where('age', '>', 20)
        *   .pluck('firstName')
        *   .then(function (firstNames) {
        *     console.log(typeof firstNames[0]); // --> string
        *   });
        * ```
        *
        * @param {String} propertyName
        *    The name of the property to pluck.
        *
        * @returns {QueryBuilder}
        */
        pluck( propertyName : string ) : QueryBuilderInstance;
        
        /**
        * If the result is an array, selects the first item.
        *
        * ```js
        * Person
        *   .query()
        *   .first()
        *   .then(function (firstPerson) {
        *     console.log(person.age);
        *   });
        * ```
        *
        * @returns {QueryBuilder}
        */
        first() : any;
    
        /**
        * Creates an insert query.
        *
        * Inserts an object or an array of objects. The array version only works on Postgres because
        * Postgres is the only database engine that returns the identifiers of _all_ inserted rows.
        * knex supports batch inserts on other databases also, but you only get the id of the first
        * (or last) inserted object as a result. If you need batch insert on other databases you
        * can use knex directly through `YourModel.knexQuery()`.
        *
        * The inserted objects are validated against the model's `jsonSchema`. If validation fails
        * the Promise is rejected with a `ValidationError`.
        *
        * Examples:
        *
        * ```js
        * Person
        *   .query()
        *   .insert({firstName: 'Jennifer', lastName: 'Lawrence'})
        *   .then(function (jennifer) {
        *     console.log(jennifer.id);
        *   });
        * ```
        *
        * Batch insert (Only works on Postgres):
        *
        * ```js
        * someMovie
        *   .$relatedQuery('actors')
        *   .insert([
        *     {firstName: 'Jennifer', lastName: 'Lawrence'},
        *     {firstName: 'Bradley', lastName: 'Cooper'}
        *   ])
        *   .then(function (actors) {
        *     console.log(actors[0].firstName);
        *     console.log(actors[1].firstName);
        *   });
        * ```
        *
        * @param {Object|Model|Array.<Object|Model>} objects
        *    Objects to insert.
        *
        * @method
        * @returns {QueryBuilder}
        */
        insert(object : any) : QueryBuilderInstance;
        
        
        /**
        * Creates an update query.
        *
        * The update object is validated against the model's `jsonSchema`. If validation fails
        * the Promise is rejected with a `ValidationError`.
        *
        * This method is meant for updating _whole_ objects with all required properties. If you
        * want to update a subset of properties use the `patch()` method.
        *
        * This method is mainly useful when updating a single model.
        *
        * Examples:
        *
        * ```js
        * Person
        *   .query()
        *   .update({firstName: 'Jennifer', lastName: 'Lawrence', age: 24})
        *   .where('id', 134)
        *   .then(function (update) {
        *     console.log(update.toJSON());
        *   });
        * ```
        *
        * @param {Object|Model} object
        *    The update object.
        *
        * @method
        * @returns {QueryBuilder}
        */
        update( object : any ) : QueryBuilderInstance;
 
        /**
        * Creates an patch query.
        *
        * The patch object is validated against the model's `jsonSchema` _but_ the `required` property
        * of the `jsonSchema` is ignored. This way the properties in the patch object are still validated
        * but an error isn't thrown if the patch object doesn't contain all required properties.
        *
        * If validation fails the Promise is rejected with a `ValidationError`.
        *
        * Examples:
        *
        * ```js
        * Person
        *   .query()
        *   .patch({age: 24})
        *   .where('id', 134)
        *   .then(function (patch) {
        *     console.log(patch.toJSON());
        *   });
        * ```
        *
        * @param {Object} object
        *    The update object.
        *
        * @method
        * @returns {QueryBuilder}
        */
        patch(data: any): QueryBuilderInstance;
        
        /**
        * Creates a delete query.
        *
        * Examples:
        *
        * ```js
        * Person
        *   .query()
        *   .delete()
        *   .where('age', '>', 100)
        *   .then(function () {
        *     console.log('removed over 100 year old people');
        *   });
        * ```
        *
        * @method
        * @returns {QueryBuilder}
        */
        delete() :  QueryBuilderInstance;
        
        /**
        * Relates an existing model to another model.
        *
        * This method doesn't create a new instance but only updates the foreign keys and in
        * the case of ManyToMany relation, creates a join row to the join table.
        *
        * On Postgres multiple models can be related by giving an array of identifiers.
        *
        * ```js
        * Person
        *   .query()
        *   .where('id', 123)
        *   .first()
        *   .then(function (person) {
        *     return person.$relatedQuery('movies').relate(50);
        *   })
        *   .then(function () {
        *     console.log('movie 50 is now related to person 123 through `movies` relation');
        *   });
        * ```
        *
        * @method
        * @param {Number|String|Array.<Number|String>} ids
        * @returns {QueryBuilder}
        */
        relate(ids : number | string | number[] | string[]) : QueryBuilderInstance;
        
        /**
        * Removes a connection between two models.
        *
        * Doesn't delete the models. Only removes the connection. For ManyToMany relations this
        * deletes the join column from the join table. For other relation types this sets the
        * join columns to null.
        *
        * ```js
        * Person
        *   .query()
        *   .where('id', 123)
        *   .first()
        *   .then(function (person) {
        *     return person.$relatedQuery('movies').unrelate().where('id', 50);
        *   })
        *   .then(function () {
        *     console.log('movie 50 is no longer related to person 123 through `movies` relation');
        *   });
        * ```
        *
        * @method
        * @returns {QueryBuilder}
        */
        unrelate() : QueryBuilderInstance;

        //!MISSING: Json functions and knex overrides

    }
    
    export interface ModelOptions {
        
        /**
         *  If true the json is treated as a patch and the `required` field of the json schema is
         *  ignored in the validation. This allows us to create models with a subset of required
         *  properties for patch operations.
         */
        patch? : boolean;
        
        /**
         * If true the json schema validation is skipped.
         */
        skipValidation? : boolean;
    }

    /**
    * Relation expression is a simple DSL for expressing relation trees.
    *
    * For example an expression `children.[movies.actors.[pets, children], pets]` represents a tree:
    *
    * ```
    *               children
    *               (Person)
    *                  |
    *          -----------------
    *          |               |
    *        movies           pets
    *       (Movie)         (Animal)
    *          |
    *        actors
    *       (Person)
    *          |
    *     -----------
    *     |         |
    *    pets    children
    *  (Animal)  (Person)
    *
    * ```
    *
    * The model classes are shown in parenthesis.
    *
    * This class rarely needs to be used directly. The relation expression can be given to a bunch
    * of functions in objection.js. For example:
    *
    * ```js
    * Person
    *   .query()
    *   .eager('children.[movies.actors.[pets, children], pets]')
    *   .then(function (persons) {
    *     // All persons have the given relation tree fetched.
    *     console.log(persons[0].children[0].movies[0].actors[0].pets[0].name);
    *   });
    * ```
    *
    * There are two tokens that have special meaning: `*` and `^`. `*` means "all relations recursively" and
    * `^` means "this relation recursively".
    *
    * For example `children.*` means "relation `children` and all its relations, and all their relations and ...".
    * The `*` token must be used with caution or you will end up fetching your entire database.
    *
    * Expression `parent.^` is equivalent to `parent.parent.parent.parent...` up to the point a relation no longer
    * has results for the `parent` relation.
    *
    */
    export class RelationExpression
    {
        
        /**
        * Parses an expression string into a {@link RelationExpression} object.
        *
        * @param {String} expression
        * @returns {RelationExpression}
        */
        static parse(expression : string) : RelationExpression;
    }
    
    /**
    * Starts a transaction.
    *
    * Give the the model classes you want to use in the transaction as arguments to this
    * function. The model classes are bound to a newly created transaction and passed to
    * the callback. All queries created using the bound model classes or any result acquired
    * through them take part in the same transaction.
    *
    * You must return a promise from the callback. If this promise is fulfilled the transaction
    * is committed. If the promise is rejected the transaction is rolled back.
    *
    * Examples:
    *
    * ```js
    * objection.transaction(Person, Animal, function (Person, Animal) {
    *
    *  return Person
    *    .query()
    *    .insert({firstName: 'Jennifer', lastName: 'Lawrence'})
    *    .then(function () {
    *      return Animal.query().insert({name: 'Scrappy'});
    *    });
    *
    * }).then(function (scrappy) {
    *   console.log('Jennifer and Scrappy were successfully inserted');
    * }).catch(function (err) {
    *   console.log('Something went wrong. Neither Jennifer nor Scrappy were inserted');
    * });
    * ```
    *
    * Related model classes are automatically bound to the same transaction. So if you use
    * `Animal` implicitly through `Person`'s relations you don't have to bind Animal explicitly.
    * The following example clarifies this:
    *
    * ```js
    * objection.transaction(Person, function (Person) {
    *
    *  return Person
    *    .query()
    *    .insert({firstName: 'Jennifer', lastName: 'Lawrence'})
    *    .then(function (jennifer) {
    *      // This insert takes part in the transaction even though we didn't explicitly
    *      // bind the `Animal` model class.
    *      return jennifer.$relatedQuery('pets').insert({name: 'Scrappy'});
    *    });
    *
    * }).then(function (scrappy) {
    *   console.log('Jennifer and Scrappy were successfully inserted');
    * }).catch(function (err) {
    *   console.log('Something went wrong. Neither Jennifer nor Scrappy were inserted');
    * });
    * ```
    *
    * Inside the callback `this` is the knex transaction object. So if you need to create
    * knex queries you can do this:
    *
    * ```js
    * objection.transaction(Person, function (Person) {
    *  var knex = this;
    *
    *  return Person
    *    .query()
    *    .insert({firstName: 'Jennifer', lastName: 'Lawrence'})
    *    .then(function (jennifer) {
    *      return knex.insert({name: 'Scrappy'}}.into('Animal');
    *    });
    *
    * }).then(function () {
    *   console.log('Jennifer and Scrappy were successfully inserted');
    * }).catch(function (err) {
    *   console.log('Something went wrong. Neither Jennifer nor Scrappy were inserted');
    * });
    * ```
    */
    export function transaction( model : Model, callback : (model: Model) => Promise<any>) : Promise<any>;

    /**
    * Error of this class is thrown when a Model validation fails.
    */
    export interface ValidationError extends Error
    {
        statusCode : number;
        
         /**
        * A hash of `{'property name': 'error message'}` pairs.
        *
        * @type {Object.<String, String>}
        */
        data : any;
        
    }
    
    /**
    * Error of this class is thrown when a Model validation fails.
    *
    * @param {Object.<String, String>} errorMessages
    * @constructor
    */
    export function ValidationError(errorMessages : any) : ValidationError; 


    export interface Relation {
        
    }
    
    export interface OneToOneRelation extends Relation {
    }
    
    export interface OneToManyRelation extends Relation {
    }
    
    export interface ManyToManyRelation extends Relation {
    }

    export interface RelationType {
        
    }
    
    export interface OneToOneRelationType extends RelationType {
    }
    
    export interface OneToManyRelationType extends RelationType {
    }
    
    export interface ManyToManyRelationType extends RelationType {
    }

}