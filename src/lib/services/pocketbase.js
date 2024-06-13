import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_API_URL);

export const getCategories = async (fetch) => {
    return await pb.collection('categories').getFullList({ 
        sort: '-title', 
        expand: 'category',
        $autoCancel: false // Disable auto-cancellation
    });
};

export const getWorks = async (fetch) => {
    const categories = await getCategories(fetch);
    const newestWorks = [];

    for (const category of categories) {
        const works = await pb.collection('works').getFullList({
            filter: `category="${category.id}"`,
            sort: '-date',
            limit: 1,
            expand: 'category',
            $autoCancel: false // Disable auto-cancellation
        });
        if (works.length > 0) {
            newestWorks.push(works[0]);
        }
    }

    return newestWorks;
};

export const getWorksByCategory = async (fetch, categoryTitle) => {
    const category = await pb
        .collection('categories')
        .getFirstListItem(`title="${categoryTitle}"`, { 
            expand: 'category',
            $autoCancel: false // Disable auto-cancellation
        });
    return await pb.collection('works').getFullList({
        filter: `category="${category.id}"`,
        sort: '-date',
        expand: 'category',
        $autoCancel: false // Disable auto-cancellation
    });
};

export const getOwner = async (fetch, id) => {
    return await pb.collection('users').getOne(id, {
        $autoCancel: false // Disable auto-cancellation
    });
};

export const getWorkById = async (fetch, workId) => {
    return await pb.collection('works').getOne(workId, { 
        expand: 'category',
        $autoCancel: false // Disable auto-cancellation
    });
};
