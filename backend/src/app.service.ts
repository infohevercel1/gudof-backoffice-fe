import { Injectable } from '@nestjs/common';

interface queryType {
  code?: string
}

@Injectable()
export class AppService {
  getHello(query: queryType): string {
    return 'Hello World!' + query.code;
  }
}
