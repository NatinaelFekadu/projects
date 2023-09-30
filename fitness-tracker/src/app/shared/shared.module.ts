import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  exports: [CommonModule, FormsModule, AngularMaterialModule, FlexLayoutModule],
})
export class SharedModule {}
