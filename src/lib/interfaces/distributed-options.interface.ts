import { GraphQLResolverMap } from 'apollo-graphql';
import { GqlModuleOptions } from '@nestjs/graphql';

export interface DistributedModuleOptions extends GqlModuleOptions {
  referenceResolvers?: GraphQLResolverMap<any>,
}
