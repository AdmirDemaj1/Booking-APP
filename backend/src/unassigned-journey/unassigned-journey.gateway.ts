import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class UnassignedJourneyGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: { id: string }) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: { id: string }) {
    console.log('Client disconnected:', client.id);
  }

  notifyNewUnassignedJourney(journey: any) {
    this.server.emit('newUnassignedJourney', journey);
  }
}
