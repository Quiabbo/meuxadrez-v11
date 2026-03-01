import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Check, 
  X, 
  Star, 
  ShieldCheck, 
  Trophy, 
  BookOpen, 
  PenTool, 
  Users, 
  GraduationCap, 
  Target, 
  Gift, 
  Lock, 
  Truck,
  ArrowRight,
  ShoppingCart,
  Bell
} from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string; answer: string; key?: React.Key }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-black/10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-accent transition-colors"
      >
        <span className="font-display font-bold text-lg text-secondary">{question}</span>
        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-text-muted leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WaitlistModal = ({ isOpen, onClose, onWaitlistSuccess }: { isOpen: boolean; onClose: () => void; onWaitlistSuccess: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('https://formsubmit.co/ajax/filipi.hadji.dsg@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _subject: "fila de espera",
          _captcha: "false"
        }),
      });
      const result = await response.json();
      if (result.success === "true" || response.ok) {
        setStatus('success');
        onWaitlistSuccess(); // Increment the counter
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ name: '', email: '', whatsapp: '' });
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-secondary">
          <X className="w-6 h-6" />
        </button>
        
        <h3 className="font-display text-2xl font-bold text-secondary mb-2">Entrar na Fila de Espera</h3>
        <p className="text-text-muted text-sm mb-6">Seja o primeiro a saber quando o novo caderno for lançado em Maio 2026.</p>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <p className="font-bold text-secondary">Inscrição realizada!</p>
            <p className="text-sm text-text-muted">Você receberá as novidades em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">Nome Completo</label>
              <input 
                required
                name="name"
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-accent outline-none transition-colors"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">E-mail</label>
              <input 
                required
                name="email"
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-accent outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">WhatsApp</label>
              <input 
                required
                name="whatsapp"
                type="tel" 
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-black/10 focus:border-accent outline-none transition-colors"
                placeholder="(00) 00000-0000"
              />
            </div>
            <button 
              disabled={status === 'loading'}
              className="cta-button !bg-accent !text-white w-full mt-4 disabled:opacity-50"
            >
              {status === 'loading' ? 'Enviando...' : 'Confirmar Inscrição'}
            </button>
            {status === 'error' && <p className="text-xs text-red-500 text-center">Ocorreu um erro. Tente novamente.</p>}
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(52);

  useEffect(() => {
    // Load count from localStorage or default to 52
    const savedCount = localStorage.getItem('meuxadrez_waitlist_count');
    if (savedCount) {
      setWaitlistCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleWaitlistSuccess = () => {
    const newCount = waitlistCount + 1;
    setWaitlistCount(newCount);
    localStorage.setItem('meuxadrez_waitlist_count', newCount.toString());
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Cadernos MeuXadrez",
      "description": "Cadernos físicos de xadrez para evolução prática.",
      "brand": {
        "@type": "Brand",
        "name": "MeuXadrez"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "reviewCount": "2300"
      }
    });
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen bg-primary text-text-main selection:bg-accent selection:text-white overflow-x-hidden font-soft">
      
      {/* WHATSAPP FLUTUANTE */}
      <a 
        href="https://wa.me/5541995403711" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        aria-label="Contato via WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <WaitlistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onWaitlistSuccess={handleWaitlistSuccess}
      />

      {/* SEÇÃO 1: HERO & LOGO */}
      <section className="relative pt-8 pb-20 md:pt-12 md:pb-24 chess-pattern-subtle">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center mb-12">
            <img 
              src="https://dicionariopanico.com.br/wp-content/uploads/2026/03/logo-meuxadrez.png" 
              alt="MeuXadrez Logo" 
              className="h-16 md:h-20 object-contain"
              referrerPolicy="no-referrer"
            />
          </nav>

          <div className="max-w-5xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-accent/10 border border-accent/20 px-4 py-2 rounded-full mb-8"
            >
              <span className="font-display text-xs md:text-sm font-bold text-accent flex items-center gap-2 uppercase tracking-widest">
                🏆 O MÉTODO #1 DO BRASIL PARA SUBIR DE RATING
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6 text-secondary"
            >
              Você Perde Partidas <br className="hidden md:block" />
              <span className="text-accent">Que Deveria Ganhar?</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-text-muted mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Enquanto você joga no improviso, jogadores medianos estão te batendo com técnica. Os dois cadernos que transformaram <span className="font-bold text-secondary">mais de 2.300</span> enxadristas brasileiros em jogadores que dominam o tabuleiro.
            </motion.p>

            {/* VENDA SEPARADA NO TOPO */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
              {/* Produto 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <img 
                  src="https://dicionariopanico.com.br/wp-content/uploads/2026/03/caderno-exercicios-Cs-8tibk-e1772372742470.png" 
                  alt="Caderno de Exercícios" 
                  className="w-48 mb-6 drop-shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <h3 className="font-display text-xl font-bold mb-2">Caderno de Exercícios</h3>
                <p className="text-text-muted text-sm mb-4">300 exercícios táticos progressivos</p>
                <div className="mt-auto w-full">
                  <p className="text-2xl font-bold text-secondary mb-4">R$ 28,71</p>
                  <a href="https://www.mercadolivre.com.br/livro-xadrez-300-exercicios-tatica-finais-xequemate/up/MLBU3739584739" className="cta-button w-full text-sm py-4">
                    <ShoppingCart className="w-4 h-4 mr-2" /> COMPRAR AGORA
                  </a>
                </div>
              </motion.div>

              {/* Produto 2 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <img 
                  src="https://dicionariopanico.com.br/wp-content/uploads/2026/03/caderno-notacao-new-DMNPdkj1-e1772372604132.png" 
                  alt="Caderno de Notação" 
                  className="w-48 mb-6 drop-shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <h3 className="font-display text-xl font-bold mb-2">Caderno de Notação</h3>
                <p className="text-text-muted text-sm mb-4">Registro e análise profissional</p>
                <div className="mt-auto w-full">
                  <p className="text-2xl font-bold text-secondary mb-4">R$ 33,56</p>
                  <a href="https://www.mercadolivre.com.br/livro-xadrez-notacao-algebrica-tabela-sumula/up/MLBU3429643591" className="cta-button w-full text-sm py-4">
                    <ShoppingCart className="w-4 h-4 mr-2" /> COMPRAR AGORA
                  </a>
                </div>
              </motion.div>

              {/* Produto 3 - Aberturas (Fila de Espera) */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-surface p-6 rounded-2xl border-2 border-dashed border-accent/30 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center relative overflow-hidden group"
              >
                {/* Simplified Placeholder Design */}
                <div className="w-full aspect-[4/3] bg-white rounded-xl mb-6 flex flex-col items-center justify-center relative overflow-hidden border border-black/5 shadow-inner">
                  <div className="absolute inset-0 chess-pattern-subtle opacity-5"></div>
                  
                  {/* Book Icon Outline */}
                  <div className="relative flex flex-col items-center">
                    <div className="relative">
                      <BookOpen className="w-24 h-24 text-accent/20" strokeWidth={0.5} />
                      {/* Slanted Black Badge */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] bg-secondary text-white px-5 py-2 rounded-xl shadow-2xl z-20 min-w-[130px] text-center">
                        <span className="font-display font-bold text-sm tracking-widest uppercase">Lançamento</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-display text-xl font-bold mb-2">Caderno de Aberturas</h3>
                <p className="text-text-muted text-sm mb-4">Aberturas + Ataque + Defesa</p>
                <div className="mt-auto w-full">
                  <p className="text-2xl font-bold text-accent mb-4">Maio 2026</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="cta-button !bg-accent !text-white w-full text-sm py-4 flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" /> Fila de espera
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                <span className="text-secondary font-bold ml-2"><strong>+2.300</strong> cadernos entregues</span>
              </div>
              <p className="text-sm text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Estoque limitado esta semana
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: AGITAÇÃO DA DOR */}
      <section className="py-20 bg-surface border-y border-black/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title">Isso já aconteceu com você?</h2>
            <div className="grid gap-4">
              {[
                "Você sabe que deveria ganhar, mas na hora H trava e comete erros bobos",
                "Você não evolui há meses, o rating empacou e você não sabe por quê",
                "Você assiste aulas no YouTube mas na prática não aplica nada",
                "Seu filho quer aprender xadrez e você não sabe como ensiná-lo do jeito certo",
                "Você perde para jogadores claramente piores e fica frustrado",
                "Você nunca registrou uma partida na vida — e isso te impede de aprender com seus erros"
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
                  className="flex items-start gap-4 p-4 bg-white border border-black/5 rounded-lg shadow-sm"
                >
                  <X className="w-6 h-6 text-red-500 shrink-0" />
                  <p className="text-lg text-text-main">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: SOBRE O AUTOR */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://dicionariopanico.com.br/wp-content/uploads/2026/03/autor-filipi-CpeRpiYZ.png" 
                alt="Filipi Hadji" 
                className="w-full max-w-sm mx-auto rounded-[6px] shadow-xl"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="md:w-1/2">
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">Sobre o Autor</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 text-secondary">Filipi Hadji</h2>
              <p className="text-accent font-medium mb-6">O Criador do Método MeuXadrez</p>
              
              <div className="space-y-4 text-lg text-text-muted leading-relaxed">
                <p>
                  Entusiasta e estudante dedicado de xadrez, focado em ajudar jogadores a evoluírem através de treino prático e consistente. Acredito que qualquer pessoa pode melhorar drasticamente seu xadrez com o método certo.
                </p>
                <p>
                  Criei o MeuXadrez porque vi muitos jogadores frustrados, gastando horas em partidas sem evoluir. A solução? Treino focado em padrões de mate, organizado de forma progressiva, que qualquer pessoa pode fazer em 15 minutos por dia.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-accent" />
                  <span className="font-bold text-sm">Treino Prático</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-accent" />
                  <span className="font-bold text-sm"><strong>+2.300</strong> Alunos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: PARA QUEM É - COM ESTÉTICA DE XADREZ ANIMADA */}
      <section className="py-20 animated-chess-dark border-y border-white/5 relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="section-title !text-white">ESSES CADERNOS SÃO PARA VOCÊ SE...</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: GraduationCap, title: "Para o Iniciante", text: "Quer aprender xadrez do zero com método." },
              { icon: Target, title: "Para subir rating", text: "Está empacado e precisa de treino estruturado." },
              { icon: Users, title: "Para pais", text: "Presente que desenvolve raciocínio e foco." },
              { icon: PenTool, title: "Para professores", text: "Material didático profissional para turmas." },
              { icon: Trophy, title: "Para competidores", text: "Quer chegar no torneio mais preparado." },
              { icon: Gift, title: "Para presentear", text: "Presente diferente, inteligente e duradouro." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-black/40 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/10 text-center group"
              >
                <item.icon className="w-10 h-10 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-display font-bold mb-2 text-white">{item.title}</h4>
                <p className="text-sm text-white/60 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO: GANCHO PRÓXIMO LANÇAMENTO */}
      <section className="py-24 bg-surface relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border-2 border-accent/20 p-8 md:p-16 relative shadow-2xl overflow-hidden">
            {/* Elemento Decorativo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-3/5">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="inline-block bg-accent text-white text-xs font-bold px-4 py-1 rounded-[6px] mb-6 uppercase tracking-widest"
                >
                  Em Desenvolvimento: Lançamento Maio 2026
                </motion.div>
                
                <h2 className="font-display text-3xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                  Cansado de <span className="text-accent underline decoration-accent/30 underline-offset-8">Perder a Partida</span> Antes Mesmo do Lance 15?
                </h2>
                
                <div className="space-y-6 text-lg text-text-muted leading-relaxed mb-10">
                  <p>
                    Você já sentiu aquela frustração de sair da abertura em desvantagem? Ou pior, ter uma posição ganha e não saber como <span className="font-bold text-secondary">executar o ataque final</span>, deixando a vitória escapar por entre os dedos?
                  </p>
                  <p>
                    O xadrez moderno não perdoa quem hesita. Se você não domina os <span className="font-bold text-secondary">padrões de abertura</span>, se desmorona sob pressão defensiva ou se perde na hora de atacar, seu rating continuará estagnado.
                  </p>
                  <p className="font-display font-bold text-secondary text-xl">
                    Estamos criando a ferramenta definitiva para resolver isso:
                  </p>
                  <div className="bg-accent/5 border-l-4 border-accent p-4 italic text-secondary font-medium">
                    "Novo Caderno MeuXadrez: Aberturas Estratégicas + Ataque Implacável + Defesa de Ferro"
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="cta-button !bg-accent !text-white w-full sm:w-auto hover:scale-105 transition-transform"
                  >
                    Entrar na fila de espera
                  </button>
                  <span className="text-sm font-bold text-accent flex items-center gap-2">
                    <Users className="w-5 h-5" /> +{waitlistCount} enxadristas já na lista
                  </span>
                </div>
              </div>

              <div className="md:w-2/5 relative">
                <div className="aspect-square bg-white rounded-3xl border border-black/5 flex flex-col items-center justify-center p-8 relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 chess-pattern-subtle opacity-5"></div>
                  
                  {/* Book Icon Outline (Replicating the Image) */}
                  <div className="relative flex flex-col items-center">
                    <div className="relative">
                      <BookOpen className="w-32 h-32 text-accent/20" strokeWidth={0.5} />
                      {/* Slanted Black Badge */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg] bg-secondary text-white px-7 py-3 rounded-2xl shadow-2xl z-20 min-w-[160px] text-center">
                        <span className="font-display font-bold text-lg tracking-widest">MAIO 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: OFERTA KIT COMPLETO */}
      <section id="oferta" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">OU ECONOMIZE COM O KIT COMPLETO</h2>
          
          <div className="max-w-lg mx-auto">
            <motion.div 
              whileInView={{ scale: 1 }}
              initial={{ scale: 0.95 }}
              className="bg-surface border-2 border-secondary rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-secondary text-white py-4 text-center font-display font-bold text-xl uppercase tracking-widest">
                MELHOR ESCOLHA
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 mb-8 items-center">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-4 gap-2">
                      <div>
                        <h3 className="text-2xl font-display font-bold mb-1 text-secondary">Combo MeuXadrez</h3>
                        <p className="text-text-muted text-sm">Exercícios + Notação</p>
                      </div>
                      <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        FRETE GRÁTIS
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-text-muted line-through text-sm">De: R$ 189,90</p>
                      <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <span className="text-4xl font-display font-bold text-secondary">R$ 129,90</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "Caderno de Exercícios Físico",
                    "Caderno de Notação Físico",
                    "Frete Grátis para todo Brasil",
                    "Garantia Incondicional de 7 dias",
                    "Pagamento 100% Seguro"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-accent" />
                      <span className="font-medium text-text-main">{item}</span>
                    </div>
                  ))}
                </div>

                <a href="https://www.mercadolivre.com.br/livros-xadrez--combo-exercicios-e-notacao/up/MLBU3804259543" className="cta-button w-full mb-6">
                  👑 QUERO O KIT COMPLETO
                </a>

                <div className="flex justify-center items-center gap-4 text-text-muted text-sm">
                  <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Compra segura</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Garantia total</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: FAQ */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="section-title">DÚVIDAS FREQUENTES</h2>
          <div className="max-w-3xl mx-auto">
            {[
              { q: "Para qual nível de jogador é indicado?", a: "Para todos do absoluto iniciante ao intermediário avançado. O Caderno de Exercícios tem progressão crescente de dificuldade. O Caderno de Notação é universal." },
              { q: "É um e-book ou caderno físico?", a: "São cadernos físicos, impressos com qualidade profissional. Você vai receber no seu endereço via Correios." },
              { q: "Quanto tempo para receber?", a: "Enviamos no mesmo dia pelos Correios. O prazo médio é de 1 a 5 dias após confirmação do pagamento." },
              { q: "Posso comprar separado?", a: "Sim, no topo desta página você encontra os links para compra individual de cada caderno." },
              { q: "É indicado para crianças?", a: "Sim! A partir de 6-7 anos (com apoio de um adulto) até qualquer idade. Muitos pais compram para estimular o foco dos filhos." },
              { q: "E se eu não gostar?", a: "Garantia total de 7 dias. Devolução sem complicação e reembolso integral do valor pago." }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 bg-secondary text-white border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <img 
              src="https://dicionariopanico.com.br/wp-content/uploads/2026/03/logo-meuxadrez.png" 
              alt="MeuXadrez Logo" 
              className="h-12 object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
            <div className="flex gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-accent transition-colors">Privacidade</a>
              <a href="#" className="hover:text-accent transition-colors">Termos</a>
              <a href="#" className="hover:text-accent transition-colors">Contato</a>
            </div>
          </div>
          <div className="text-center text-xs text-white/40">
            <p>© 2025 MeuXadrez — Todos os direitos reservados</p>
            <p className="mt-2">Suporte: filipi.hadji.dsg@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
