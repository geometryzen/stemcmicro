import { getJestProjectsAsync } from "@nx/jest";

export default async () => ({
    projects: [...(await getJestProjectsAsync()), "<rootDir>/path/to/jest.config.ts"]
});
