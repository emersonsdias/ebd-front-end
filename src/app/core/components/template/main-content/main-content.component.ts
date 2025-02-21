import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";

@Component({
  selector: 'app-main-content',
  imports: [RouterOutlet, SectionTitleComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

}
