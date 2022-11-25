export default function RepoInfo({ repo }) {
	let license;
	
	switch (repo.licenseInfo?.spdxId) {
		case undefined:
			license = (
				<span
					className='px-1 py-1 mx-1 btn btn-sm btn-danger'
					style={{ fontSize: '.6rem' }}
				>
					NO LICENCE
				</span>
			);
			break;
		case 'NOASSERTION':
			license = (
				<span
					className='px-1 py-1 mx-1 btn btn-sm btn-warning'
					style={{ fontSize: '.6rem' }}
				>
					{repo.licenseInfo.spdxId}
				</span>
			);
			break;
		default:
			license = (
				<span
					className='px-1 py-1 mx-1 btn btn-sm btn-outline-success'
					style={{ fontSize: '.6rem' }}
				>
					{repo.licenseInfo.spdxId}
				</span>
			);
	}

	return (
		<li className='list-group-item' key={repo.id.toString()}>
			<div className='d-flex justify-content-between align-items-center'>
				<div className='d-flex flex-column'>
					<a href={repo.url} className='h5 mb-0 text-decoration-none'>
						{repo.name}
					</a>
					{repo.description && (
						<p className='small'>{repo.description}</p>
					)}
				</div>
				<div className='text-nowrap mx-3'>
					{license}
					<span
						className={`px-1 py-1 mx-1 d-inline-block btn btn-sm ${
							repo.viewerSubscription === 'SUBSCRIBED'
								? 'btn-success'
								: 'btn-outline-secondary'
						}
						`}
						style={{ fontSize: '.6rem' }}
					>
						{' '}
						{repo.viewerSubscription}
					</span>
				</div>
			</div>
		</li>
	);
}
