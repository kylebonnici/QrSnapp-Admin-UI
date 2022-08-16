import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {Location} from '@angular/common';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Output() toggleNotificationsSidenav = new EventEmitter<void>();

    constructor(public router: Router,
                private location: Location,
                public authenticationService: AuthenticationService) {
    }

    ngOnInit() {
    }

    back() {
        this.location.back();
    }
}
