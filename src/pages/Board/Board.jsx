import BoardFeature from '@/features/board';

export default function BoardPage() {
  return (
    <div className="board-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BoardFeature />
    </div>
  );
}
