import semver from 'semver';
import axios from 'axios';
import urlJoin from 'url-join';

export const DEFAULT_REGISTRY: string = 'https://registry.npmjs.org';

// 获取npm仓库信息
export const getNpmInfo = async (npmName: string, registry: string = DEFAULT_REGISTRY): Promise<any> => {
    if (!npmName) {
        return;
    }
    const npmInfoUrl: string = urlJoin(registry, npmName);
    return axios.get(npmInfoUrl).then((res) => {
        if (res.status === 200) {
            return res.data;
        }
        return null;
    }).catch((err) => Promise.reject(err));
};

// 获取所有版本号
export const getNpmVersions = async (npmName: string, registry: string = DEFAULT_REGISTRY): Promise<string[]> => {
    const npmInfo = await getNpmInfo(npmName, registry);
    if (npmInfo) {
        return Object.keys(npmInfo.versions);
    }
    return [];
};

// 获取更新于当前的版本号
const getGTVersions = (baseVersion: string, versions: string[]): string[] => versions
    .filter((v) => semver.satisfies(v, `^${baseVersion}`))
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1));

// 获取最新版本号
export const getLatestVersion = async (
    baseVersion: string,
    npmName: string,
    registry: string = DEFAULT_REGISTRY,
): Promise<string> => {
    const versions: string[] = await getNpmVersions(npmName, registry);
    const gtVersions: string[] = getGTVersions(baseVersion, versions);
    if (gtVersions && gtVersions.length) {
        return gtVersions[0];
    }
    return null;
};
