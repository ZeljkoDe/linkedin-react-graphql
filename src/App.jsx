import { useEffect, useState, useCallback } from 'react';
import github from './db'; //needs to be created - use personal github access token
import query from './Query';
import { NavButtons, RepoInfo, SearchBox } from './components';

export default function App() {
	let [userName, setUserName] = useState('');
	let [repoList, setRepoList] = useState([]);
	let [pageCount, setPageCount] = useState(10);
	let [queryString, setQueryString] = useState('');
	let [totalCount, setTotalCount] = useState(null);

	let [startCursor, setStartCursor] = useState(null);
	let [endCursor, setEndCursor] = useState(null);
	let [hasPreviousPage, setHasPreviousPage] = useState(false);
	let [hasNextPage, setHasNextPage] = useState(true);
	let [paginationKeyword, setPaginationKeyword] = useState('first');
	let [paginationString, setPaginationString] = useState('');

	const fetchData = useCallback(() => {
		const queryText = JSON.stringify(
			query(pageCount, queryString, paginationKeyword, paginationString)
		);
		fetch(github.baseURL, {
			method: 'POST',
			headers: github.headers,
			body: queryText,
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const viewer = data.data.viewer;
				const repos = data.data.search.edges;
				const total = data.data.search.repositoryCount;
				const start = data.data.search.pageInfo?.startCursor;
				const end = data.data.search.pageInfo?.endCursor;
				const next = data.data.search.pageInfo?.nextCursor;
				const prev = data.data.search.pageInfo?.prevCursor;

				setUserName(viewer.name);
				setRepoList(repos);
				setTotalCount(total);
				setStartCursor(start);
				setEndCursor(end);
				setHasNextPage(next);
				setHasPreviousPage(prev);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [pageCount, queryString, paginationKeyword, paginationString]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const repos =
		repoList &&
		repoList.map((repo) => (
			<RepoInfo key={repo.node.id} repo={repo.node} />
		));

	return (
		<div className='container mt-5'>
			<h1 className='text-primary'>
				<i className='bi bi-diagram-2-fill'></i>Report
			</h1>
			<p>Hey there {userName}</p>

			<SearchBox
				totalCount={totalCount}
				pageCount={pageCount}
				queryString={queryString}
				onTotalChange={(myNumber) => {
					setPageCount(myNumber);
				}}
				onQueryChange={(myString) => {
					setQueryString(myString);
				}}
			/>
			
			<NavButtons
				start={startCursor}
				end={endCursor}
				next={hasNextPage}
				previous={hasPreviousPage}
				onPage={(myKeyword, myString) => {
					setPaginationKeyword(myKeyword);
					setPaginationString(myString);
				}}
			/>

			<ul className='list-group list-group-flush'>{repos}</ul>
		</div>
	);
}
