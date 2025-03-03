import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from 'app/entities/metis/post.model';
import { PostingHeaderDirective } from 'app/shared/metis/posting-header/posting-header.directive';
import { MetisService } from 'app/shared/metis/metis.service';
import { PostCreateEditModalComponent } from 'app/shared/metis/posting-create-edit-modal/post-create-edit-modal/post-create-edit-modal.component';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs/esm';
import { getAsChannelDto } from 'app/entities/metis/conversation/channel.model';

@Component({
    selector: 'jhi-post-header',
    templateUrl: './post-header.component.html',
    styleUrls: ['../../metis.component.scss'],
})
export class PostHeaderComponent extends PostingHeaderDirective<Post> implements OnInit, OnDestroy {
    @Input()
    readOnlyMode = false;
    @Input() lastReadDate?: dayjs.Dayjs;
    @Input() previewMode: boolean;
    @ViewChild(PostCreateEditModalComponent) postCreateEditModal?: PostCreateEditModalComponent;
    isAtLeastInstructorInCourse: boolean;
    mayEditOrDelete = false;

    // Icons
    faPencilAlt = faPencilAlt;

    constructor(protected metisService: MetisService) {
        super(metisService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.isAtLeastInstructorInCourse = this.metisService.metisUserIsAtLeastInstructorInCourse();
        const isCourseWideChannel = getAsChannelDto(this.posting.conversation)?.isCourseWide ?? false;
        const isAtLeastInstructorInCourse = this.metisService.metisUserIsAtLeastInstructorInCourse();
        const mayEditOrDeleteOtherUsersAnswer =
            (isCourseWideChannel && isAtLeastInstructorInCourse) || (getAsChannelDto(this.metisService.getCurrentConversation())?.hasChannelModerationRights ?? false);
        this.mayEditOrDelete = !this.readOnlyMode && !this.previewMode && (this.isAuthorOfPosting || mayEditOrDeleteOtherUsersAnswer);
    }

    /**
     * on leaving the page, the modal should be closed
     */
    ngOnDestroy(): void {
        this.postCreateEditModal?.modalRef?.close();
    }

    /**
     * invokes the metis service to delete a post
     */
    deletePosting(): void {
        this.metisService.deletePost(this.posting);
    }
}
