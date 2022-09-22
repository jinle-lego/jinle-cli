import path from 'path';

// 格式windows/mac路径
const formatPath = (p: string): string => (
    p && typeof p === 'string' && path.sep !== '/'
        ? p.replace(/\\/g, '/')
        : p
);

export default formatPath;
