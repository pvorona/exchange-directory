import { Exchange, LoadableStatus, ensureNever, useQuery } from '../utils';
import { useRouter } from 'next/router';

async function listExchanges(init?: RequestInit): Promise<readonly Exchange[]> {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/exchanges?per_page=10',
    {
      headers: {
        accept: 'application/json',
      },
      ...init,
    }
  );
  return await response.json();
}

function stopPropagation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.stopPropagation();
}

export function Index() {
  const exchangeList = useQuery<readonly Exchange[]>(listExchanges);
  const router = useRouter();

  if (exchangeList.status === LoadableStatus.Idle) {
    return null;
  }

  if (exchangeList.status === LoadableStatus.Loading) {
    return <div>Loading...</div>;
  }

  if (exchangeList.status === LoadableStatus.Failed) {
    return <div>Error: {exchangeList.error}</div>;
  }

  if (exchangeList.status === LoadableStatus.Completed) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>URL</th>
            <th>Trust Rank</th>
          </tr>
        </thead>
        <tbody>
          {exchangeList.data.map((exchange) => (
            <tr
              key={exchange.id}
              className="hover focus-visible:bg-[hsl(var(--b2))] outline-none cursor-pointer"
              onClick={() => router.push(`/exchanges/${exchange.id}`)}
              onKeyDown={(event) => {
                if ('Enter' === event.key) {
                  router.push(`/exchanges/${exchange.id}`);
                }
              }}
              tabIndex={0}
              role="link"
            >
              <td className="flex items-center">
                <div className="avatar mr-2">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={exchange.image} alt="" />
                  </div>
                </div>

                {exchange.name}
              </td>
              <td>{exchange.country}</td>
              <td>
                <a
                  href={exchange.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link"
                  onClick={stopPropagation}
                >
                  {exchange.url}
                </a>
              </td>
              <td>{exchange.trust_score_rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  ensureNever(exchangeList);
}

export default Index;
