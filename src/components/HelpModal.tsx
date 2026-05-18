import { memo } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = memo(function HelpModal({
  isOpen,
  onClose,
}: HelpModalProps) {
  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    fontFamily: '"Noto Sans SC", sans-serif',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#1a1a2e',
    textAlign: 'center',
  };

  const introStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#4a5568',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#f0f4f8',
    borderRadius: '8px',
    borderLeft: '4px solid #4a7c59',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '20px',
    marginBottom: '12px',
    color: '#4a7c59',
    borderBottom: '2px solid #e8e4dd',
    paddingBottom: '6px',
  };

  const sectionContentStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#4a5568',
    marginBottom: '16px',
  };

  const closeButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4a7c59',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '20px',
    fontFamily: '"Noto Sans SC", sans-serif',
    transition: 'all 0.15s ease',
  };

  const methodBoxStyle: React.CSSProperties = {
    backgroundColor: '#f7fafc',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    borderLeft: '3px solid #4a7c59',
  };

  const subTitleStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  };

  const noteStyle: React.CSSProperties = {
    fontSize: '13px',
    lineHeight: '1.7',
    color: '#718096',
    padding: '12px',
    backgroundColor: '#fffbeb',
    borderRadius: '6px',
    marginTop: '12px',
    borderLeft: '3px solid #f6ad55',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>数独解法指南</div>
        
        <div style={introStyle}>
          <strong>核心原则：</strong>利用已知条件，通过逻辑推导逐步排除不可能的数字，最终确定唯一的正确答案。整个过程不需要任何盲目猜测。
        </div>

        <div style={sectionTitleStyle}>核心基础：解题的两大基石</div>
        <div style={sectionContentStyle}>
          数独的规则很简单：每行、每列、每个九宫格（3×3）内的数字 1-9 必须出现且只出现一次。基于这个规则，衍生出了最基本的两个观察方向：
        </div>

        <div style={methodBoxStyle}>
          <div style={subTitleStyle}>1. 摒除法（排除法）—— 找"数字"安放的位置</div>
          <div style={sectionContentStyle}>
            这是最常用、最直观的方法。当你关注某一个数字（比如 5）时，利用已有的 5 去排除它所在的行、列或九宫格，从而找出某一个九宫格（或行、列）中唯一能填入 5 的格子。
            <br /><br />
            <strong>• 单元格摒除（宫摒除）：</strong>观察一个九宫格，利用周围行和列已有的某个数字进行排除，使该九宫格内只剩下一个格子可以填入该数字。
            <br /><br />
            <strong>• 行列摒除：</strong>观察某一行或某一列，利用其他九宫格的数字排除掉该行或该列的某些格子，直到只剩一个空格可以填入目标数字。
          </div>
        </div>

        <div style={methodBoxStyle}>
          <div style={subTitleStyle}>2. 余数法（唯余法）—— 找"格子"能填的数字</div>
          <div style={sectionContentStyle}>
            这种方法是以<strong>格子</strong>为中心。当你盯住某一个空格时，观察它所在的行、列、九宫格里已经出现了哪些数字。
            <br /><br />
            <strong>• 唯一余数：</strong>如果该格子所在的行、列、九宫格里，已经合起来出现了 8 个不同的数字，那么这个格子<strong>只能</strong>填剩下的那第 9 个数字。
          </div>
        </div>

        <div style={sectionTitleStyle}>进阶技巧：利用"候选数"破局</div>
        <div style={sectionContentStyle}>
          当简单的直观观察无法推进时，我们需要在空格中写下所有可能的数字（称为<strong>候选数</strong>），然后利用逻辑消除它们。
        </div>

        <div style={methodBoxStyle}>
          <div style={subTitleStyle}>1. 区块摒除法（Locked Candidates）</div>
          <div style={sectionContentStyle}>
            有时候，某个数字在某个九宫格内虽然不能马上锁定位置，但它只能出现在该九宫格的<strong>某一行或某一列</strong>。
            <br /><br />
            <strong>逻辑：</strong>既然这个数字一定在这几格里，那它就必然占据了这一行（或列）。因此，<strong>这一行（或列）在其他九宫格里的格子，就可以安全地排除掉这个候选数。</strong>
          </div>
        </div>

        <div style={methodBoxStyle}>
          <div style={subTitleStyle}>2. 显性/隐性数对（Pairs）</div>
          <div style={sectionContentStyle}>
            这是推导过程中的关键突破点。
            <br /><br />
            <strong>• 显性数对（Naked Pair）：</strong>如果在同一行、同一列或同一个九宫格内，有<strong>两个格子</strong>的候选数都<strong>只有相同的两个数</strong>（例如都是 [2, 7]）。
            <br />
            <em>结论：</em>这两个格子必然一个填 2，一个填 7。因此，<strong>这一行/列/宫内的其他所有格子，都可以删掉 2 和 7 这两个候选数。</strong>
            <br /><br />
            <strong>• 隐性数对（Hidden Pair）：</strong>如果在某一行/列/宫里，数字 2 和 7 <strong>只出现在某两个格子中</strong>（尽管这两个格子可能还包含其他候选数，比如 [2, 5, 7] 和 [2, 7, 9]）。
            <br />
            <em>结论：</em>因为 2 和 7 没地方可去，必须待在这两个格子里，所以这两格里的其他数字（如 5 和 9）都是不可能的，可以<strong>直接擦除</strong>。
          </div>
        </div>

        <div style={noteStyle}>
          <strong>注：</strong>数对的概念还可以扩展到"三数集（Triples）"和"四数集（Quads）"，逻辑完全相同。
        </div>

        <div style={methodBoxStyle}>
          <div style={subTitleStyle}>3. X-Wing（X翼/双十字定向）</div>
          <div style={sectionContentStyle}>
            这是一种进阶的高级技巧，用于在全局范围内消除候选数。
            <br /><br />
            <strong>形态：</strong>寻找<strong>两行</strong>，在这两行中，某个候选数（比如 4）<strong>都只能填在相同的两列上</strong>（这四个格子的位置刚好构成一个矩形的四个顶点）。
            <br /><br />
            <strong>逻辑：</strong>无论实际如何填，数字 4 最终必然会占据这个矩形的对角线位置。也就是说，这两列的数字 4 已经被这两行承包了。
            <br /><br />
            <strong>结论：</strong><strong>这两列中，处于其他行上的所有格子，都可以安全地删掉候选数 4。</strong>
          </div>
        </div>

        <div style={sectionTitleStyle}>高效的解题步骤建议</div>
        <div style={sectionContentStyle}>
          在实际做题时，建议遵循以下节奏，避免看花眼：
          <br /><br />
          <strong>1. 全局扫描（1到9循环）：</strong>盯着数字 1，用摒除法把所有九宫格扫一遍，能填的填上；然后看 2，看 3……直到 9。通常第一轮能填出不少基础数字。
          <br /><br />
          <strong>2. 盯紧"钉子户"（行/列/宫）：</strong>寻找那些已经填了 6-7 个数字的行、列或九宫格，利用唯余法把剩下的 2-3 个空格补齐。
          <br /><br />
          <strong>3. 标记候选数：</strong>题目卡住时，开始在空格里用小字写上候选数。优先写 candidate 数量少的格子（比如只有 2 个可能性的）。
          <br /><br />
          <strong>4. 运用进阶逻辑：</strong>利用数对、区块或 X-Wing 擦除多余的候选数。一旦某个格子的候选数被删到只剩一个，立刻填入，并以此为线索引发连锁反应。
        </div>

        <div style={noteStyle}>
          解数独最大的乐趣就在于逻辑链条被推导卡点打破后的豁然开朗。从基础的行列排除练起，慢慢培养对数字排列的敏感度，你就能挑战更高难度的题目了！
        </div>

        <button
          style={closeButtonStyle}
          onClick={onClose}
        >
          知道了
        </button>
      </div>
    </div>
  );
});
