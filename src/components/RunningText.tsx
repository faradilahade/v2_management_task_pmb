import { useApp } from '../contexts/AppContext';
import './RunningText.css';

export function RunningText() {
  const { tasks, dispositionTasks } = useApp();

  // Combine all tasks and dispositions
  const allItems = [
    ...tasks.map((t) => ({
      type: 'request',
      text: `📋 ${t.title} - Deadline: ${new Date(t.deadline).toLocaleDateString('id-ID')} - Status: ${t.status}`,
    })),
    ...dispositionTasks.map((d) => ({
      type: 'disposition',
      text: `📌 ${d.title}${d.period ? ` (${d.period.toUpperCase()})` : ''} - Penerima: ${d.receiverNames.join(', ')}`,
    })),
  ];

  return (
    <div className="running-text-container bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-950 dark:to-blue-900 text-white py-2 overflow-hidden">
      <div className="running-text-content">
        {allItems.map((item, index) => (
          <span key={index} className="running-text-item mx-8">
            {item.text}
          </span>
        ))}
        {/* Duplicate untuk seamless loop */}
        {allItems.map((item, index) => (
          <span key={`dup-${index}`} className="running-text-item mx-8">
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}