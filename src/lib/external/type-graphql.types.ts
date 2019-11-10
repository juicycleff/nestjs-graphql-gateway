// Taken from: https://github.com/nestjs/graphql/blob/master/lib/external/type-graphql.types.ts

/* tslint:disable:ban-types */
import { Type } from '@nestjs/common';
import { GraphQLDirective, GraphQLScalarType } from 'graphql';

/**
 * Some external types have to be included in order to provide types safety
 * because the package is marked as optional.
 * @external
 * see: https://github.com/19majkel94/type-graphql
 * 0.16.0
 */
export type TypeValue =
  | Type<any>
  | GraphQLScalarType
  | Function
  | object
  | symbol;
export type ReturnTypeFuncValue = TypeValue | [TypeValue];
export type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;
export type NullableListOptions = 'items' | 'itemsAndList';
export interface DecoratorTypeOptions {
  nullable?: boolean | NullableListOptions;
  defaultValue?: any;
}
export interface TypeOptions extends DecoratorTypeOptions {
  array?: boolean;
}
export interface DescriptionOptions {
  description?: string;
}
export interface DepreciationOptions {
  deprecationReason?: string;
}
export interface SchemaNameOptions {
  name?: string;
}
export interface ResolverClassOptions {
  isAbstract?: boolean;
}
export type ClassTypeResolver = (of?: void) => Type<any>;
export type BasicOptions = DecoratorTypeOptions & DescriptionOptions;
export type AdvancedOptions = BasicOptions &
  DepreciationOptions &
  SchemaNameOptions;

export interface SchemaGeneratorOptions {
  /**
   * Array of resolvers classes
   */
  resolvers?: Function[] | string[];
  /**
   * Array of orphaned type classes that are not used explicitly in GraphQL types definitions
   */
  orphanedTypes?: Function[];
  /**
   * Disable checking on build the correctness of a schema
   */
  skipCheck?: boolean;

  /**
   * Array of graphql directives
   */
  directives?: GraphQLDirective[];
}

export interface BuildSchemaOptions extends SchemaGeneratorOptions{
  dateScalarMode?: DateScalarMode;
  scalarsMap?: ScalarsTypeMap[];
}


export type DateScalarMode = 'isoDate' | 'timestamp';
export interface ScalarsTypeMap {
  type: Function;
  scalar: GraphQLScalarType;
}
