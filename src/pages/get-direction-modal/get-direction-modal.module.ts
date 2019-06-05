import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetDirectionModalPage } from './get-direction-modal';

@NgModule({
  declarations: [
    GetDirectionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GetDirectionModalPage),
  ],
})
export class GetDirectionModalPageModule {}
