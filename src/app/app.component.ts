import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgClass,

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent implements OnInit {
  interviewForm: FormGroup;
  title = 'IntSch';

  // Dropdown options
  interviewTypes = ['In-Office', 'Telephonic', 'Google-meet'];
  role = ['Remote', 'On-site', 'Hybrid'];
  interviewPanels = ['Vaibhav, Shivangi, Nandini', 'Aniket, Dravid, Roshan', 'Yash, Rohit, Harshil'];

  roundNumber = [1, 2, 3];
  minDateTime!: string; // Minimum datetime for the scheduled date field
  selectedType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.interviewForm = this.fb.group({
      empName: ['', [Validators.required, this.nameValidator]],
      recMail: ['', [Validators.required, Validators.email]],
      candidateName: ['', [Validators.required, this.nameValidator]],
      role: [''], // Optional
      candidateEmail: ['', [Validators.required, Validators.email]],
      phone: [''], // Optional, dynamically validated
      interviewType: ['', Validators.required],
      interviewPanel: ['', Validators.required],
      roundNumber: ['', Validators.required],
      candidateInstructions: ['', [Validators.maxLength(50)]],
      scheduledDate: ['', [Validators.required, this.futureDateValidator]],
      link: [''], // Dynamically validated
      location: [''], // Dynamically validated
    });
  }

  ngOnInit(): void {
    // Set the minimum date-time to the current date-time
    const now = new Date();
    this.minDateTime = now.toISOString().slice(0, 16); // Format for datetime-local input

    // Dynamically update validators based on interviewType
    this.interviewForm.get('interviewType')?.valueChanges.subscribe((selectedType) => {
      this.updateValidators(selectedType);
    });
  }

  nameValidator(control: AbstractControl): ValidationErrors | null {
    const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    const isValid = nameRegex.test(control.value.trim());
    return isValid ? null : { invalidName: true };
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const phoneNumberRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/; // Allows international formats
    if (!control.value) {
      return null;
    }
    const isValid = phoneNumberRegex.test(control.value);
    const minLength = 10; // Minimum digits
    const maxLength = 10; // Maximum digits

    const cleanedValue = control.value.replace(/\D/g, ''); // Remove non-digit characters
    const length = cleanedValue.length;

    return isValid && length >= minLength && length <= maxLength ? null : { invalidPhoneNumber: true };
  }

  googleMeetLinkValidator(control: AbstractControl): ValidationErrors | null {
    const googleMeetRegex = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
    if (!control.value) {
      return null;
    }
    const isValid = googleMeetRegex.test(control.value);
    return isValid ? null : { invalidLink: true };
  }

  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    // Check if the selected date and time is in the future
    if (selectedDate.getTime() < currentDate.getTime()) {
      return { invalidDate: true }; // Error if the date or time is in the past
    }

    return null; // Valid if the date and time are today or in the future
  }

  updateValidators(type: string): void {
    const linkControl = this.interviewForm.get('link');
    const phoneControl = this.interviewForm.get('phone');
    const locationControl = this.interviewForm.get('location');


    // Clear all validators
    linkControl?.clearValidators();
    phoneControl?.clearValidators();
    locationControl?.clearValidators();

    // Apply validators based on the selected type
    if (type === 'Google-meet') {
      linkControl?.setValidators([Validators.required, this.googleMeetLinkValidator]);
    } else if (type === 'Telephonic') {
      phoneControl?.setValidators([Validators.required, this.phoneNumberValidator]);
    } else if (type === 'In-Office') {
      locationControl?.setValidators([Validators.required, Validators.maxLength(100)]);
    }

    // Update the form controls' validity
    linkControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();
    locationControl?.updateValueAndValidity();
  }


  onSubmit() {
    if (this.interviewForm.valid) {
      this.http.post('http://localhost:8080/api/interviews', this.interviewForm.value).subscribe({
        next: (response) => {
          this.openDialog('Success', 'Interview scheduled successfully!');

          this.interviewForm.reset({
            empName: '',
            recMail: '',
            candidateName: '',
            role: '',
            candidateEmail: '',
            phone: '',
            interviewType: '',
            interviewPanel: '',
            roundNumber: '',
            candidateInstructions: '',
            scheduledDate: '',
            link: '',
            location: '',
          });
        },
        error: (error) => {
          console.error(error);
          this.openDialog('Error', 'Failed to schedule interview. Please try again.');
        },
        complete: () => {
          console.log('HTTP request completed.');
        },
      });
    } else {
      this.openDialog('Warning', 'Please fill in all mandatory fields.');
    }
  }

  openDialog(title: string, message: string): void {
    this.dialog.open(CustomDialogComponent, {
      data: { title, message },
      width: '400px',
    });
  }

  get locationControl() {
    return this.interviewForm.get('location');
  }

  onTypeChange() {
    this.selectedType = this.interviewForm.get('interviewType')?.value;
  }
}
