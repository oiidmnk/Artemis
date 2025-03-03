import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingService } from 'app/exercises/shared/manage/paging.service';
import { PageableSearch, SearchResult } from 'app/shared/table/pageable-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearningPathInformationDTO } from 'app/entities/competency/learning-path.model';

type EntityResponseType = SearchResult<LearningPathInformationDTO>;
@Injectable({ providedIn: 'root' })
export class LearningPathPagingService extends PagingService<LearningPathInformationDTO> {
    public resourceUrl = 'api';

    constructor(private http: HttpClient) {
        super();
    }

    override search(pageable: PageableSearch, options: { courseId: number }): Observable<EntityResponseType> {
        const params = this.createHttpParams(pageable);
        return this.http
            .get(`${this.resourceUrl}/courses/${options.courseId}/learning-paths`, { params, observe: 'response' })
            .pipe(map((resp: HttpResponse<EntityResponseType>) => resp && resp.body!));
    }
}
