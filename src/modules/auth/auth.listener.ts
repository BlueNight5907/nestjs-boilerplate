import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NonFunctionProperties } from 'definitions/@types';

import { TestEvent } from './events/test.event';

@Injectable()
export class AuthListener {
  @OnEvent(TestEvent.publishableEventName)
  handleOrderCreatedEvent(event: NonFunctionProperties<TestEvent>) {
    // handle and process "OrderCreatedEvent" event
    console.info(event, '--------');
  }
}
