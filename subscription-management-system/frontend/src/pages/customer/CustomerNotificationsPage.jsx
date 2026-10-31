import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  Calendar,
  Receipt,
  CreditCard,
  Sparkles,
  CheckCheck,
  Clock
} from 'lucide-react';
import { useMockData } from '../../contexts/MockDataContext';
import { Button } from '../../components/ui/Button';

export const CustomerNotificationsPage = () => {
  const {
    customerNotifications,
    markCustomerNotificationRead,
    markAllCustomerNotificationsRead
  } = useMockData();

  const [filter, setFilter] = useState('all');

  const filteredNotifications = customerNotifications?.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  }) || [];

  const getIcon = (type) => {
    switch (type) {
      case 'renewal':
        return <Calendar className="w-4 h-4 text-cherry" />;
      case 'invoice':
        return <Receipt className="w-4 h-4 text-champagne-gold" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-cherry-dark" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-espresso tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-espresso-muted">
            Important updates regarding your renewal notices, billing statements, and subscription activity.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={CheckCheck}
          className="text-xs"
          onClick={markAllCustomerNotificationsRead}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-warm pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-cherry text-ivory shadow-sm'
              : 'text-espresso-muted hover:text-espresso hover:bg-champagne/60'
          }`}
        >
          All Notifications ({customerNotifications?.length || 0})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            filter === 'unread'
              ? 'bg-cherry text-ivory shadow-sm'
              : 'text-espresso-muted hover:text-espresso hover:bg-champagne/60'
          }`}
        >
          Unread ({customerNotifications?.filter((n) => !n.read).length || 0})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markCustomerNotificationRead(notif.id)}
            className={`rounded-2xl border p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-all ${
              notif.read
                ? 'bg-ivory border-stone-warm opacity-80 hover:opacity-100'
                : 'bg-ivory border-2 border-cherry/40 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-champagne-light border border-stone-warm flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-sm font-bold text-espresso">{notif.title}</h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-cherry shrink-0" />
                  )}
                </div>
                <p className="text-xs text-espresso-muted leading-relaxed">{notif.message}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-espresso-muted font-medium pt-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{notif.timestamp}</span>
                </div>
              </div>
            </div>

            {!notif.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markCustomerNotificationRead(notif.id);
                }}
                className="text-[11px] font-semibold text-cherry hover:underline shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="bg-ivory rounded-3xl border border-stone-warm shadow-luxury p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-display text-sm font-bold text-espresso">No notifications</p>
            <p className="text-xs text-espresso-muted">You are all caught up with your subscription notices.</p>
          </div>
        )}
      </div>
    </div>
  );
};
