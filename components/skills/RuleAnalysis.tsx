'use client'

import { useState } from 'react'
import { Brain, AlertTriangle, CheckCircle, Clock, FileText, Cpu, ChevronRight, RefreshCw } from 'lucide-react'

const SAMPLE_RULE = `如果特朗普在2024年美国总统大选中赢得超过270张选举人票，且获胜声明在投票日后7天内由美联社正式发布，则该市场以"是"结算。

任何选举结果的重新计票或法律挑战均不影响市场结算。若出现以下情况，市场将延期至最终结果明确：(1) 关键摇摆州选票差距小于0.5%，(2) 联邦法院介入。

市场结算依据：美联社官方声明、CNN和Fox News的同步报道。结算日期不晚于2024年11月15日。`

const parsedResult = {
  triggerConditions: [
    { text: '赢得 >270 张选举人票', confidence: 99, type: 'primary' },
    { text: '美联社正式发布获胜声明', confidence: 95, type: 'primary' },
    { text: '关键摇摆州票差 >0.5%', confidence: 87, type: 'secondary' },
  ],
  timeConstraints: [
    { text: '声明须在投票日后 7 天内发布', severity: 'medium' },
    { text: '最晚结算日期：2024年11月15日', severity: 'low' },
  ],
  dataSources: ['美联社 (AP)', 'CNN', 'Fox News'],
  exclusions: ['重新计票', '法律挑战', '联邦法院介入'],
  riskFactors: [
    { label: '规则模糊度', score: 18, color: '#00d4aa' },
    { label: '时间风险', score: 42, color: '#ffa502' },
    { label: '争议风险', score: 35, color: '#ff4757' },
    { label: '数据源风险', score: 12, color: '#00d4aa' },
  ],
  overallScore: 82,
  verdict: '规则较为清晰',
}

export default function RuleAnalysis() {
  const [inputText, setInputText] = useState(SAMPLE_RULE)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setShowResult(false)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setShowResult(true)
          return 100
        }
        return p + 4
      })
    }, 60)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full animate-fade-in">
      {/* Left: Input */}
      <div className="lg:w-5/12 flex flex-col gap-4">
        <div className="rounded-xl p-4" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} style={{ color: '#a855f7' }} />
            <span className="text-sm font-medium text-slate-200">市场规则文本</span>
            <span className="ml-auto text-xs text-slate-500">{inputText.length} 字符</span>
          </div>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="w-full text-xs text-slate-300 leading-relaxed resize-none outline-none"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              minHeight: '200px',
              color: '#cbd5e1',
            }}
          />
        </div>

        {/* Options */}
        <div className="rounded-xl p-4" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-medium text-slate-400 mb-3">分析选项</div>
          <div className="grid grid-cols-2 gap-2">
            {['条件提取', '时间分析', '风险评估', '数据源验证'].map(opt => (
              <label key={opt} className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <div className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.3)', border: '1px solid rgba(168,85,247,0.5)' }}>
                  <CheckCircle size={9} style={{ color: '#a855f7' }} />
                </div>
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: isAnalyzing ? 'rgba(168,85,247,0.3)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
            color: 'white',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          }}
        >
          {isAnalyzing ? (
            <>
              <Cpu size={15} className="animate-spin" />
              AI 正在分析... {progress}%
            </>
          ) : (
            <>
              <Brain size={15} />
              开始语义分析
            </>
          )}
        </button>

        {/* Progress */}
        {isAnalyzing && (
          <div className="rounded-xl p-3" style={{ background: '#0d1421', border: '1px solid rgba(168,85,247,0.2)' }}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">NLP 处理中</span>
              <span style={{ color: '#a855f7' }}>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #a855f7, #4f88ff)' }} />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {progress < 30 ? '▶ 分词与实体识别...' : progress < 60 ? '▶ 条件逻辑提取...' : progress < 85 ? '▶ 风险因素评估...' : '▶ 生成分析报告...'}
            </div>
          </div>
        )}
      </div>

      {/* Right: Results */}
      <div className="lg:w-7/12 flex flex-col gap-4">
        {!showResult && !isAnalyzing && (
          <div className="flex-1 rounded-xl flex items-center justify-center" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)', minHeight: '300px' }}>
            <div className="text-center text-slate-500">
              <Brain size={40} className="mx-auto mb-3 opacity-30" />
              <div className="text-sm">输入规则文本后点击「开始语义分析」</div>
            </div>
          </div>
        )}

        {showResult && (
          <>
            {/* Overall score */}
            <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(79,136,255,0.08))', border: '1px solid rgba(168,85,247,0.3)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-1">综合清晰度评分</div>
                  <div className="text-4xl font-bold" style={{ color: '#a855f7', fontFamily: 'JetBrains Mono, monospace' }}>
                    {parsedResult.overallScore}
                    <span className="text-xl">/100</span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#00d4aa' }}>✓ {parsedResult.verdict}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {parsedResult.riskFactors.map(rf => (
                    <div key={rf.label} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 w-20 text-right">{rf.label}</span>
                      <div className="w-24 progress-bar">
                        <div className="progress-fill" style={{ width: `${rf.score}%`, background: rf.color }} />
                      </div>
                      <span className="text-xs font-mono" style={{ color: rf.color, width: '28px' }}>{rf.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trigger conditions */}
            <div className="rounded-xl p-4" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={13} style={{ color: '#00d4aa' }} />
                <span className="text-sm font-medium text-slate-200">触发条件</span>
              </div>
              <div className="space-y-2">
                {parsedResult.triggerConditions.map((cond, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(168,85,247,0.2)', color: '#a855f7' }}>
                      {i + 1}
                    </div>
                    <span className="text-xs text-slate-300 flex-1">{cond.text}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-12 progress-bar" style={{ height: '3px' }}>
                        <div className="progress-fill" style={{ width: `${cond.confidence}%`, background: '#00d4aa' }} />
                      </div>
                      <span className="text-xs" style={{ color: '#00d4aa', fontFamily: 'monospace' }}>{cond.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time + Sources + Exclusions row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl p-3" style={{ background: '#0d1421', border: '1px solid rgba(255,165,2,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock size={11} style={{ color: '#ffa502' }} />
                  <span className="text-xs font-medium" style={{ color: '#ffa502' }}>时间限制</span>
                </div>
                {parsedResult.timeConstraints.map((t, i) => (
                  <div key={i} className="text-xs text-slate-400 mb-1 leading-relaxed">{t.text}</div>
                ))}
              </div>
              <div className="rounded-xl p-3" style={{ background: '#0d1421', border: '1px solid rgba(79,136,255,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText size={11} style={{ color: '#4f88ff' }} />
                  <span className="text-xs font-medium" style={{ color: '#4f88ff' }}>数据来源</span>
                </div>
                {parsedResult.dataSources.map((s, i) => (
                  <div key={i} className="text-xs text-slate-400 mb-1">· {s}</div>
                ))}
              </div>
              <div className="rounded-xl p-3" style={{ background: '#0d1421', border: '1px solid rgba(255,71,87,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle size={11} style={{ color: '#ff4757' }} />
                  <span className="text-xs font-medium" style={{ color: '#ff4757' }}>排除条款</span>
                </div>
                {parsedResult.exclusions.map((e, i) => (
                  <div key={i} className="text-xs text-slate-400 mb-1">✗ {e}</div>
                ))}
              </div>
            </div>

            <button onClick={() => setShowResult(false)} className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-300 transition-colors">
              <RefreshCw size={11} /> 重新分析
            </button>
          </>
        )}
      </div>
    </div>
  )
}
