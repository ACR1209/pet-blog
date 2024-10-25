export function getPaginationData(page: number, perPage: number, totalRecords: number) {
    const totalPages = Math.ceil(totalRecords / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
        nextPage,
        prevPage,
        page,
        totalRecords,
        totalPages,
        perPage
    }
}