export type Blog = {
    video?: string;
    image?: string;
    name: string;
    link?: string;
    description: string;
    date: string;
    type: string | 'news' | 'blog';
    slug?: string;
};

export type BlogList = Blog[]