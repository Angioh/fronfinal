// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideNgxStripe } from 'ngx-stripe';
import { appConfig } from './app/app.config';

const stripePublicKey = 'pk_test_51RXPJsBsgAu3P7yyZ2oSy3TW5Ndkdk4TZZjE2C62Dl2DLCvrhpaklXXyye9bJp0DhSAmN8TltRi587uLN41GuEeh00ZqwOtQb2';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideNgxStripe(stripePublicKey),
    ...(appConfig.providers ?? [])
  ]
})
.catch((err) => console.error(err));
