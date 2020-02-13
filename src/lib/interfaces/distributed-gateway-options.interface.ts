import { GatewayConfig } from '@apollo/gateway';
import { GqlModuleOptions } from '@nestjs/graphql';
import { Omit } from '@nestjs/graphql/dist/interfaces/gql-module-options.interface';
import { BuildSchemaOptions } from '../external/type-graphql.types';

// tslint:disable-next-line
export interface IDistributedGatewayOptions extends GqlModuleOptions, Omit<GatewayConfig, ''>, IServiceList {}

interface IServiceList {
  serviceList: ServiceListItem[];
}

interface ServiceListItem {
 name: string;
 url: string;
}

interface ExtendedTypeGraphQLOption {
  buildSchemaOptions?: BuildSchemaOptions;
}

export interface FedGqlModuleOptions extends Omit<GqlModuleOptions, 'buildSchemaOptions'>, ExtendedTypeGraphQLOption {}

