import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout {}
