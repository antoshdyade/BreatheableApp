import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStreak, formatSeconds, interpretControlPause } from './wellnessData';

test('formatSeconds converts seconds into MM:SS correctly', () => {
  assert.equal(formatSeconds(0), '00:00');
  assert.equal(formatSeconds(65), '01:05');
  assert.equal(formatSeconds(1500), '25:00');
  assert.equal(formatSeconds(300), '05:00');
});

test('calculateStreak counts consecutive dates accurately', () => {
  const dates = ['2026-11-09', '2026-11-08', '2026-11-07'];
  assert.equal(calculateStreak(dates, '2026-11-09'), 3);
  
  // Completed yesterday but not today yet
  const datesYesterday = ['2026-11-08', '2026-11-07'];
  assert.equal(calculateStreak(datesYesterday, '2026-11-09'), 2);
  
  // Broken streak (missed yesterday)
  const brokenStreak = ['2026-11-06', '2026-11-05'];
  assert.equal(calculateStreak(brokenStreak, '2026-11-09'), 0);
  
  // Empty
  assert.equal(calculateStreak([], '2026-11-09'), 0);
});

test('interpretControlPause categorizes educational CP scores safely', () => {
  const low = interpretControlPause(8);
  assert.equal(low.label, 'Gentle Support Needed');

  const good = interpretControlPause(25);
  assert.equal(good.label, 'Good Functional Baseline');

  const high = interpretControlPause(42);
  assert.equal(high.label, 'Exceptional Calm & Control');
});
