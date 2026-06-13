export default function ErrorMessage({ message }) { return ( <div className="container py-5">
<div className="alert alert-danger text-center" role="alert"> {message} </div>
</div> ); }