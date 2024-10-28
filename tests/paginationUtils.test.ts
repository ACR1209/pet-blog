import { expect } from '@jest/globals';
import { getPaginationData } from '../src/utils/pagination';

describe('getPaginationData', () => {
    it('should return correct pagination data for the first page', () => {
        const result = getPaginationData(1, 10, 50);
        expect(result).toEqual({
            prevPage: null,
            nextPage: 2,
            page: 1,
            totalRecords: 50,
            totalPages: 5,
            perPage: 10
        });
    });

    it('should return correct pagination data for a middle page', () => {
        const result = getPaginationData(3, 10, 50);
        expect(result).toEqual({
            prevPage: 2,
            nextPage: 4,
            page: 3,
            totalRecords: 50,
            totalPages: 5,
            perPage: 10
        });
    });

    it('should return correct pagination data for the last page', () => {
        const result = getPaginationData(5, 10, 50);
        expect(result).toEqual({
            nextPage: null,
            prevPage: 4,
            page: 5,
            totalRecords: 50,
            totalPages: 5,
            perPage: 10
        });
    });

    it('should return correct pagination data when there are no records', () => {
        const result = getPaginationData(1, 10, 0);
        expect(result).toEqual({
            nextPage: null,
            prevPage: null,
            page: 1,
            totalRecords: 0,
            totalPages: 0,
            perPage: 10
        });
    });

    it('should return correct pagination data when total records are less than per page', () => {
        const result = getPaginationData(1, 10, 5);
        expect(result).toEqual({
            nextPage: null,
            prevPage: null,
            page: 1,
            totalRecords: 5,
            totalPages: 1,
            perPage: 10
        });
    });

    it('should return correct pagination data when on a page with fewer records than per page', () => {
        const result = getPaginationData(2, 10, 15);
        expect(result).toEqual({
            nextPage: null,
            prevPage: 1,
            page: 2,
            totalRecords: 15,
            totalPages: 2,
            perPage: 10
        });
    });
});