import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const roomRoutes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(roomRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoomRoutingModule { }
