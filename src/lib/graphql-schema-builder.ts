/* tslint:disable:ban-types */
import federationDirectives from '@apollo/federation/dist/directives';
import { Injectable } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { ScalarsExplorerService } from '@nestjs/graphql/dist/services/scalars-explorer.service';
import { GraphQLSchema, specifiedDirectives } from 'graphql';
import { BuildSchemaOptions } from './external/type-graphql.types';
import { lazyMetadataStorage } from '@nestjs/graphql/dist/storages/lazy-metadata.storage';

@Injectable()
export class FedGraphQLSchemaBuilder {
  constructor(
    private readonly scalarsExplorerService: ScalarsExplorerService,
  ) {}

  async build(
    autoSchemaFile: string | boolean,
    options: Omit<BuildSchemaOptions, 'skipCheck'>,
    resolvers: Function[],
  ): Promise<any> {
    lazyMetadataStorage.load();
    const scalarsMap = this.scalarsExplorerService.getScalarsMap();
    const buildSchema = this.loadBuildSchemaFactory();

    try {
      return await buildSchema({
        ...options,
        directives: [...specifiedDirectives, ...federationDirectives, ...(options && options.directives || [])],
        emitSchemaFile: autoSchemaFile !== true ? autoSchemaFile : false,
        validate: false,
        scalarsMap,
        resolvers,
        skipCheck: true,
      });
    } catch (err) {
      if (err && err.details) {
        // tslint:disable-next-line:no-console
        console.error(err.details);
      }
      throw err;
    }
  }

  private loadBuildSchemaFactory(): (...args: any[]) => GraphQLSchema {
    const { buildSchema } = loadPackage('type-graphql', 'SchemaBuilder', () =>
      require('type-graphql'),
    );
    return buildSchema;
  }
}
