import useSWR from 'swr';

async function fetcher(url, ticker) {
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            ticker: ticker,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        error.status = res.status;
        error.info = await res.json();
        throw error;
    }

    return await res.json();
}

function useStockRecommendations(ticker) {
    const { data, error } = useSWR(
        ['/api/recommendationsfetcher', ticker],
        fetcher,
        { refreshInterval: 60000 }
    );

    return {
        recommendations: data,
        isLoading: !error && !data,
        isError: error
    }
}

export default useStockRecommendations;