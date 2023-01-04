import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, Observable, observable, switchMap } from 'rxjs';
import { laptop } from '../Shared/Models/laptop.model';
import { LaptopService } from '../Shared/Services/laptop.service';

@Component({
  selector: 'app-laptop-management',
  templateUrl: './laptop-management.component.html',
  styleUrls: ['./laptop-management.component.css']
})
export class LaptopManagementComponent implements OnInit {

  public laptops : laptop[];

  public editingLaptop?: laptop;


  searchField = new FormControl('');
  searchText$ = new BehaviorSubject('');
  searchResult$: Observable<laptop[]>;

  addForm = new FormGroup({
    modelName : new FormControl('', Validators.required),
    price : new FormControl('', Validators.required)
  });

  editForm = new FormGroup({
    modelName: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required)
  });

  addLaptop(){
    this.laptopService.addLaptop({
      id:'',
      modelName: this.addForm.value.modelName,
      price: this.addForm.value.price
    }).subscribe(()=>{
      this.loadLaptops();
    });
  }
  editLaptop(Laptop: laptop){
    this.editingLaptop = Laptop;

    this.editForm.setValue({
      modelName: this.editingLaptop?.modelName,
      price: this.editingLaptop.price
    });
  }
cancelEdit(){
  this.editingLaptop = undefined;
}
  updateLaptop(){
    this.laptopService.updateLaptop({
      id: this.editingLaptop!.id,
      modelName: this.editForm.value.modelName,
      price: this.editForm.value.price
    }).subscribe(d=> {
      this.editingLaptop = undefined;
      this.loadLaptops();
    })
  }

  loadLaptops(){
    this.laptopService.getLaptops().subscribe(d=>{
      this.laptops = d;
    });
  }

  deleteLaptop(id: string){
    this.laptopService.deleteLaptop(id).subscribe(()=> {
      this.loadLaptops();
    })
  }

  constructor(private laptopService: LaptopService) { }

  ngOnInit(): void {
    this.loadLaptops();
    
    this.searchField.valueChanges.subscribe(this.searchText$);

    this.searchResult$ = this.searchText$.pipe(
      debounceTime(500),
      switchMap(query => this.laptopService.findLaptopByName(query))
    );

  }

}
