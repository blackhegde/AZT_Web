export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
}

export interface Category {
    id: string;
    name: string;
    description: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    token: string;
}

export interface Admin {
    id: string;
    username: string;
    email: string;
    token: string;
}

export interface AuthResponse {
    user: User | Admin;
    token: string;
}