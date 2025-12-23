
/**
 * Fetches public repositories for a specific GitHub user.
 * @param {string} username - The GitHub username.
 * @returns {Promise<Array>} - List of repositories.
 */
export const fetchGitHubRepos = async (username = 'binodbishwakarama-max') => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();

        // Filter out forks if desired, or specific repos
        // and map to a cleaner structure
        return data.map(repo => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            homepage: repo.homepage,
            topics: repo.topics,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            updated_at: repo.updated_at
        }));
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return [];
    }
};
