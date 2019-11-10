import { ApolloGateway } from '@apollo/gateway';
import { DynamicModule, Inject, Module, OnModuleInit, Optional } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { HttpAdapterHost } from '@nestjs/core';
import { ApolloServerBase } from 'apollo-server-core';

import { IDistributedGatewayOptions } from './interfaces';
import { DISTRIBUTED_GATEWAY_OPTIONS } from './tokens';

@Module({})
export class GraphqlDistributedGatewayModule implements OnModuleInit {

  public static forRoot(options: IDistributedGatewayOptions): DynamicModule {
    return {
      module: GraphqlDistributedGatewayModule,
      providers: [
        {
          provide: DISTRIBUTED_GATEWAY_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
  private apolloServer: ApolloServerBase | undefined;

  constructor(
    @Optional()
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(DISTRIBUTED_GATEWAY_OPTIONS)
    private readonly options: IDistributedGatewayOptions,
  ) {}

  public async onModuleInit() {
    if (!this.httpAdapterHost) { return; }
    const { httpAdapter } = this.httpAdapterHost;

    if (!httpAdapter) { return; }

    const {
      options: {
        __exposeQueryPlanExperimental,
        debug,
        // @ts-ignore
        serviceList,
        installSubscriptionHandlers,
        buildService,
      },
    } = this;

    const gateway = new ApolloGateway({
      __exposeQueryPlanExperimental,
      debug,
      serviceList,
      buildService,
    });

    const adapterName = httpAdapter.constructor && httpAdapter.constructor.name;

    if (adapterName === 'ExpressAdapter') {
      this.registerExpress(gateway);
    } else if (adapterName === 'FastifyAdapter') {
      this.registerFastify(gateway);
    } else {
      throw new Error(`No support for current HttpAdapter: ${adapterName}`);
    }

    if (installSubscriptionHandlers) {
      this.apolloServer.installSubscriptionHandlers(
        httpAdapter.getHttpServer(),
      );
    }
  }

  private registerExpress(gateway: ApolloGateway) {
    const { ApolloServer } = loadPackage(
      'apollo-server-express',
      'GraphQLModule',
      () => require('apollo-server-express'),
    );

    const {
      __exposeQueryPlanExperimental,
      debug,
      // @ts-ignore
      serviceList,
      path,
      disableHealthCheck,
      onHealthCheck,
      cors,
      bodyParserConfig,
      installSubscriptionHandlers,
      buildService,
      ...rest
    } = this.options;

    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const app = httpAdapter.getInstance();

    const apolloServer = new ApolloServer({
      gateway,
      ...rest,
    });

    apolloServer.applyMiddleware({
      app,
      path,
      disableHealthCheck,
      onHealthCheck,
      cors,
      bodyParserConfig,
    });

    this.apolloServer = apolloServer;
  }

  private registerFastify(gateway: ApolloGateway) {
    const { ApolloServer } = loadPackage(
      'apollo-server-fastify',
      'GraphQLModule',
      () => require('apollo-server-fastify'),
    );

    const {
      __exposeQueryPlanExperimental,
      debug,
      // @ts-ignore
      serviceList,
      path,
      disableHealthCheck,
      onHealthCheck,
      cors,
      bodyParserConfig,
      installSubscriptionHandlers,
      buildService,
      ...rest
    } = this.options;

    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const app = httpAdapter.getInstance();

    // const path = this.getNormalizedPath(apolloOptions);

    const apolloServer = new ApolloServer({
      gateway,
      ...rest,
    });

    app.register(
      apolloServer.createHandler({
        path,
        disableHealthCheck,
        onHealthCheck,
        cors,
        bodyParserConfig,
      }),
    );

    this.apolloServer = apolloServer;
  }

}
