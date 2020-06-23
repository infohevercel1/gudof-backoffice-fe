export class Category {
    constructor(
        public id: number,
        public name: string,
        public path: string,
        public parent_id: number,
        public meta: {
            created_by: string,
            created_at: string
        },
    ) {}
}