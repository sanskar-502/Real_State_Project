import './list.scss'
import Card from"../card/Card"

function List({posts = []}){
  if (!posts || posts.length === 0) {
    return <div className="list empty">No posts found</div>;
  }

  return (
    <div className='list'>
      {posts.map(item=>(
        <Card 
          key={item.id} 
          item={{
            ...item,
            isSaved: item.isSaved || false // Ensure isSaved is passed to Card
          }}
        />
      ))}
    </div>
  )
}

export default List