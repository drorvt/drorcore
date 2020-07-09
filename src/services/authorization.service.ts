export default function authorize(...allowed: string[]) {
    return (request: any, response: any, next: () => any) => {
        let roles = request?.user?.roles;
        let isAllowed: boolean = allowed.includes('public') || allowed.some(role => roles.includes(role));
        if (isAllowed)
            next();
        else {
            response.status(403).json({ message: "Forbidden" });
        }
    }
}