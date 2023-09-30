import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
// import { Subscription } from 'rxjs';
import * as fromTraining from '../../training/training.reducer';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css'],
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  // private exChangedSub: Subscription | undefined;

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit(): void {
    // this.exChangedSub = this.trainingService.finishedExercisesChanged.subscribe(
    //   (exercises: Exercise[]) => {
    //   }
    // );
    this.store
      .select(fromTraining.getFinishedExercises)
      .subscribe((exercises) => {
        this.dataSource.data = exercises;
      });
    this.trainingService.fetchPastExercises();
  }

  doFilter(filterValue: Event) {
    this.dataSource.filter = (filterValue.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort!;
    this.dataSource.paginator = this.paginator!;
  }
  // ngOnDestroy(): void {
  //   this.exChangedSub?.unsubscribe();
  // }
}
