import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Post } from 'app/entities/metis/post.model';
import { PostingDirective } from 'app/shared/metis/posting.directive';
import { MetisService } from 'app/shared/metis/metis.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContextInformation, PageType, RouteComponents } from '../metis.util';
import { faBullhorn, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs/esm';
import { PostFooterComponent } from 'app/shared/metis/posting-footer/post-footer/post-footer.component';
import { OneToOneChatService } from 'app/shared/metis/conversations/one-to-one-chat.service';
import { isMessagingEnabled, isMessagingOrCommunicationEnabled } from 'app/entities/course.model';
import { Router } from '@angular/router';
import { MetisConversationService } from 'app/shared/metis/metis-conversation.service';
import { getAsChannelDto } from 'app/entities/metis/conversation/channel.model';

@Component({
    selector: 'jhi-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss', './../metis.component.scss'],
})
export class PostComponent extends PostingDirective<Post> implements OnInit, OnChanges, AfterContentChecked {
    @Input() lastReadDate?: dayjs.Dayjs;
    @Input() readOnlyMode: boolean;
    @Input() previewMode: boolean;
    // if the post is previewed in the create/edit modal,
    // we need to pass the ref in order to close it when navigating to the previewed post via post title
    @Input() modalRef?: NgbModalRef;
    @Input() showAnswers: boolean;
    @Output() openThread = new EventEmitter<void>();
    @ViewChild('postFooter') postFooterComponent: PostFooterComponent;

    displayInlineInput = false;
    routerLink: RouteComponents;
    queryParams = {};
    showAnnouncementIcon = false;

    pageType: PageType;
    contextInformation: ContextInformation;
    readonly PageType = PageType;

    // Icons
    faBullhorn = faBullhorn;
    faCheckSquare = faCheckSquare;

    constructor(
        private metisService: MetisService,
        protected changeDetector: ChangeDetectorRef,
        private oneToOneChatService: OneToOneChatService,
        private metisConversationService: MetisConversationService,
        private router: Router,
    ) {
        super();
    }

    /**
     * on initialization: evaluates post context and page type
     */
    ngOnInit() {
        super.ngOnInit();
        this.pageType = this.metisService.getPageType();
        this.contextInformation = this.metisService.getContextInformation(this.posting);
    }

    /**
     * on changed: re-evaluates context information
     */
    ngOnChanges() {
        this.contextInformation = this.metisService.getContextInformation(this.posting);
        this.routerLink = this.metisService.getLinkForPost();
        this.queryParams = this.metisService.getQueryParamsForPost(this.posting);
        this.showAnnouncementIcon = (getAsChannelDto(this.posting.conversation)?.isAnnouncementChannel && !this.isCourseMessagesPage) ?? false;
    }

    /**
     * this lifecycle hook is required to avoid causing "Expression has changed after it was checked"-error when
     * dismissing the edit-create-modal -> we do not want to store changes in the create-edit-modal that are not saved
     */
    ngAfterContentChecked() {
        this.changeDetector.detectChanges();
    }

    /**
     * ensures that only when clicking on a post title without having cmd key pressed,
     * the modal is dismissed (closed and cleared)
     */
    onNavigateToPostById($event: MouseEvent) {
        if (!$event.metaKey) {
            this.modalRef?.dismiss();
        }
    }

    /**
     * ensures that only when clicking on context without having control key pressed,
     * the modal is dismissed (closed and cleared)
     */
    onNavigateToContext($event: MouseEvent) {
        if (!$event.metaKey) {
            this.modalRef?.dismiss();
        }
    }

    /**
     * Open create answer modal
     */
    openCreateAnswerPostModal() {
        this.postFooterComponent.openCreateAnswerPostModal();
    }

    /**
     * Create a or navigate to one-to-one chat with the referenced user
     *
     * @param referencedUserLogin login of the referenced user
     */
    onUserReferenceClicked(referencedUserLogin: string) {
        const course = this.metisService.getCourse();
        if (isMessagingEnabled(course)) {
            if (this.isCourseMessagesPage) {
                this.metisConversationService.createOneToOneChat(referencedUserLogin).subscribe();
            } else {
                this.oneToOneChatService.create(course.id!, referencedUserLogin).subscribe((res) => {
                    this.router.navigate(['courses', course.id, 'messages'], {
                        queryParams: {
                            conversationId: res.body!.id,
                        },
                    });
                });
            }
        }
    }

    /**
     * Navigate to the referenced channel
     *
     * @param channelId id of the referenced channel
     */
    onChannelReferenceClicked(channelId: number) {
        const course = this.metisService.getCourse();
        if (isMessagingOrCommunicationEnabled(course)) {
            if (this.isCourseMessagesPage) {
                this.metisConversationService.setActiveConversation(channelId);
            } else {
                this.router.navigate(['courses', course.id, 'messages'], {
                    queryParams: {
                        conversationId: channelId,
                    },
                });
            }
        }
    }
}
