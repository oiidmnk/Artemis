import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exam } from 'app/entities/exam.model';
import { PagingService } from 'app/exercises/shared/manage/paging.service';
import { PageableSearch, SearchResult } from 'app/shared/table/pageable-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type EntityResponseType = SearchResult<Exam>;

@Injectable({ providedIn: 'root' })
export class ExamImportPagingService extends PagingService<Exam> {
    private static readonly resourceUrl = 'api/exams';

    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Method to get (possible) exams for import from the server
     * @param pageable object specifying search parameters
     * @param options withExercises if only exams with exercises should be included in the results
     */
    override search(pageable: PageableSearch, options: { withExercises: boolean }): Observable<EntityResponseType> {
        const params = this.createHttpParams(pageable);
        return this.http
            .get(`${ExamImportPagingService.resourceUrl}?withExercises=${options.withExercises}`, { params, observe: 'response' })
            .pipe(map((resp: HttpResponse<EntityResponseType>) => resp && resp.body!));
    }
}
