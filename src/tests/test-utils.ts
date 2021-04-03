import { prettyDOM } from '@testing-library/react';
import { writeFile } from 'fs/promises';

export function saveElement(path:string, element:Element):Promise<void> {
    const data = prettyDOM(element, 100000, { highlight:false });
    return writeFile(path, typeof data === 'string' ? data : data.toString());
}