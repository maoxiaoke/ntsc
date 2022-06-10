declare const swcLoader: (_: string, id: string) => {
    code: string;
    map: string;
    meta: {
        ext: string;
    };
};
export { swcLoader };
