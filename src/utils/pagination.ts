export function getPaginationData(page: number, perPage: number, totalRecords: number) {
    const nextPage = (Math.max(totalRecords - (page * perPage), 0)) % perPage !== 0 ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const totalPages = Math.ceil(totalRecords / perPage);

    return {
        nextPage,
        prevPage,
        page,
        totalRecords,
        totalPages,
        perPage
    }
}