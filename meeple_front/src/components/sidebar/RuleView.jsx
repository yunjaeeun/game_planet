// RuleView.jsx
import React from 'react';

const RuleView = () => {
  return (
    <div className="p-4 bg-black text-white">
      <div className="space-y-4">
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm mb-1">게임 구성</div>
          <p className="text-xs text-gray-400">
            1부터 13까지의 숫자 카드 8장씩(총 104장)으로 구성됩니다.
            각 카드에는 바퀴벌레, 쥐, 개미, 전갈 등의 해충이 그려져 있습니다.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm mb-1">게임 진행</div>
          <p className="text-xs text-gray-400">
            각 플레이어는 8장의 카드를 받습니다.
            플레이어는 자신의 차례에 카드 1장을 공개하고 앞면이 보이게 내려놓습니다.
            같은 동물 카드가 4장 모이면 해당 동물은 제거됩니다.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm mb-1">승리 조건</div>
          <p className="text-xs text-gray-400">
            가장 먼저 모든 카드를 내려놓은 플레이어가 승리합니다.
            단, 마지막 카드를 내려놓았을 때 같은 동물 카드가 4장이 되면
            해당 카드들은 제거되고 게임은 계속됩니다.
          </p>
        </div>

        <div className="bg-gray-800 rounded p-3">
          <div className="text-sm mb-1">특별 규칙</div>
          <p className="text-xs text-gray-400">
            같은 숫자의 카드가 연속해서 나오면, 해당 카드들은 즉시 제거됩니다.
            예를 들어, 숫자 8이 연속해서 3장 나오면 그 카드들은 즉시 게임에서 제거됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RuleView;