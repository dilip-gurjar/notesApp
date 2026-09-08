import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request =context.switchToHttp().getRequest();
    const {method,url}=request;
    const start=Date.now();

    console.log("========== REQUEST ==========");
    console.log("Method :", method);
    console.log("URL    :", url);

    return next.handle().pipe(
      tap(()=>{
        const time = Date.now() - start;

        console.log("========== RESPONSE ==========");
        console.log(`Completed in ${time} ms\n`);

      })
    )
   
  }
}
